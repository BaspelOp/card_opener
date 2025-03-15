-- Functions
CREATE FUNCTION update_modified_column() RETURNS TRIGGER LANGUAGE plpgsql AS $$
    BEGIN
        NEW.updated_at := now();
        RETURN NEW;
    END;
$$;

CREATE FUNCTION get_random_cards_from_package(in_package_id INTEGER) RETURNS INTEGER[] LANGUAGE plpgsql AS $$
    DECLARE
        v_packages_row RECORD;
        v_cards_rows RECORD;
        v_cards_chances_cumulative INTEGER[][];
        v_chance_sum INTEGER := 0;
        v_random_integer INTEGER;
        v_output_cards INTEGER[];
    BEGIN
        SELECT number_of_cards AS number_of_cards INTO STRICT v_packages_row
            FROM packages
            WHERE id = in_package_id;

        FOR v_cards_rows IN
            SELECT cards.id AS id, card_rarities.chance AS chance
                FROM cards_in_package
                JOIN cards ON cards_in_package.card_id = cards.id
                JOIN card_rarities ON cards.rarity_id = card_rarities.id
                WHERE cards_in_package.package_id = in_package_id
        LOOP
           v_chance_sum = v_chance_sum + v_cards_rows.chance;
           v_cards_chances_cumulative := array_cat(v_cards_chances_cumulative, ARRAY[ARRAY[v_cards_rows.id, v_chance_sum]]);
        END LOOP;

        FOR i IN 1..v_packages_row.number_of_cards LOOP
            v_random_integer := floor(random() * v_chance_sum) + 1;
            
            FOR i IN 1..array_length(v_cards_chances_cumulative, 1) LOOP
                IF v_cards_chances_cumulative[i][2] >= v_random_integer THEN
                    v_output_cards := array_append(v_output_cards, v_cards_chances_cumulative[i][1]);
                    EXIT;
                END IF;
            END LOOP;
        END LOOP;

        RETURN v_output_cards;
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
        v_users_row RECORD;
    BEGIN
        SELECT password AS password INTO STRICT v_users_row
            FROM users
            WHERE email = in_email;

        IF v_users_row.password = crypt(in_password, v_users_row.password)
        THEN
            RETURN;
        ELSE
            RAISE EXCEPTION 'Wrong password.' USING DETAIL = 'in_password after hash and users.password is not same.';
        END IF;
    END;
$$;

CREATE PROCEDURE add_owned_card(in_user_id INTEGER, in_card_id INTEGER) LANGUAGE plpgsql AS $$
    DECLARE
       v_owned_cards_row RECORD;
    BEGIN
        SELECT * INTO v_owned_cards_row FROM owned_cards WHERE user_id = in_user_id AND card_id = in_card_id;
        IF NOT FOUND
        THEN
            INSERT INTO owned_cards (user_id, card_id) VALUES (in_user_id, in_card_id);
            RETURN;
        ELSE
            UPDATE owned_cards SET quantity = quantity + 1 WHERE user_id = in_user_id AND card_id = in_card_id;
            RETURN;
        END IF;
    END;
$$;

CREATE PROCEDURE remove_owned_card(in_user_id INTEGER, in_card_id INTEGER) LANGUAGE plpgsql AS $$
    DECLARE
       v_owned_cards_row RECORD;
    BEGIN
        SELECT * INTO v_owned_cards_row FROM owned_cards WHERE user_id = in_user_id AND card_id = in_card_id;
        IF NOT FOUND
        THEN
            RAISE EXCEPTION 'User does not own this card';
        ELSE
           IF v_owned_cards_row.quantity > 1
           THEN
               UPDATE owned_cards SET quantity = quantity - 1 WHERE user_id = in_user_id AND card_id = in_card_id;
           ELSE
               DELETE FROM owned_cards WHERE user_id = in_user_id AND card_id = in_card_id;
           END IF;
           RETURN;
        END IF;
    END;
$$;

CREATE PROCEDURE create_trade_offer(in_from_user_id INTEGER, in_to_user_id INTEGER, in_offered_card_id INTEGER, in_wanted_card_id INTEGER) LANGUAGE plpgsql AS $$
    BEGIN
        CALL remove_owned_card(in_from_user_id, in_offered_card_id);
   
        INSERT INTO trades (from_user_id, to_user_id, offered_card_id, wanted_card_id) VALUES (in_from_user_id, in_to_user_id, in_offered_card_id, in_wanted_card_id);
    END;
$$;

CREATE PROCEDURE accept_trade_offer(in_trades_id INTEGER) LANGUAGE plpgsql AS $$
    DECLARE
        v_trades_row RECORD;
    BEGIN
        SELECT from_user_id, to_user_id, offered_card_id, wanted_card_id INTO STRICT v_trades_row
            FROM trades
            WHERE id = in_trades_id;

        CALL remove_owned_card(v_trades_row.to_user_id, v_trades_row.wanted_card_id);

        DELETE FROM trades WHERE id = in_trades_id;

        CALL add_owned_card(v_trades_row.from_user_id, v_trades_row.wanted_card_id);
        CALL add_owned_card(v_trades_row.to_user_id, v_trades_row.offered_card_id);
    END;
$$;

CREATE PROCEDURE remove_trade_offer(in_trades_id INTEGER) LANGUAGE plpgsql AS $$
    DECLARE
       v_trades_row RECORD;
    BEGIN
        SELECT from_user_id, offered_card_id INTO STRICT v_trades_row FROM trades WHERE id = in_trades_id;
        
        DELETE FROM trades WHERE id = in_trades_id;
        CALL add_owned_card(v_trades_row.from_user_id, v_trades_row.offered_card_id);
    END;
$$;

-- Triggers
CREATE TRIGGER update_modified_time BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_modified_column();
