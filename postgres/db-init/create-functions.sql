-- Functions
CREATE FUNCTION update_modified_column() RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at := now();
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION get_random_cards_from_package(in_package_id INTEGER) RETURNS INTEGER[] LANGUAGE plpgsql AS $$
    DECLARE
        packages_row RECORD;
        cards_rows RECORD;
        cards_chances_cumulative INTEGER[][];
        chance_sum INTEGER := 0;
        random_integer INTEGER;
        output_cards INTEGER[];
    BEGIN
        SELECT number_of_cards AS number_of_cards INTO STRICT packages_row
            FROM packages
            WHERE id = in_package_id;

        FOR cards_rows IN
            SELECT cards.id AS id, card_rarities.chance AS chance
                FROM cards_in_package
                JOIN cards ON cards_in_package.card_id = cards.id
                JOIN card_rarities ON cards.rarity_id = card_rarities.id
                WHERE cards_in_package.package_id = in_package_id
        LOOP
           chance_sum = chance_sum + cards_rows.chance;
           cards_chances_cumulative := array_cat(cards_chances_cumulative, ARRAY[ARRAY[cards_rows.id, chance_sum]]);
        END LOOP;

        FOR i IN 1..packages_row.number_of_cards LOOP
            random_integer := floor(random() * chance_sum) + 1;
            
            FOR i IN 1..array_length(cards_chances_cumulative, 1) LOOP
                IF cards_chances_cumulative[i][2] >= random_integer THEN
                    output_cards := array_append(output_cards, cards_chances_cumulative[i][1]);
                    EXIT;
                END IF;
            END LOOP;
        END LOOP;

        RETURN output_cards;
    END;
$$;

-- Procedures
CREATE PROCEDURE register(in_username NON_EMPTY_TEXT, in_email JSONB, in_password NON_EMPTY_TEXT) LANGUAGE plpgsql AS $$
    BEGIN
        INSERT INTO users (username, email, password) VALUES (in_username, in_email, crypt(in_password, gen_salt('bf')));
    END;
$$;

CREATE PROCEDURE login(in_email JSONB, in_password NON_EMPTY_TEXT) LANGUAGE plpgsql AS $$
    DECLARE
        users_row RECORD;
    BEGIN
        SELECT password AS password INTO STRICT users_row
            FROM users
            WHERE email = in_email;

        IF users_row.password = crypt(in_password, users_row.password)
        THEN
            RETURN;
        ELSE
            RAISE EXCEPTION 'Wrong password.' USING DETAIL = 'in_password after hash and users.password is not same.';
        END IF;
    END;
$$;

-- Triggers
CREATE TRIGGER update_modified_time BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_modified_column();
