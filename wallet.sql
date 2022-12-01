/************ Update: Schemas ***************/

COMMENT ON SCHEMA public IS NULL;




/************ Update: Tables ***************/

/******************** Add Table: public.account ************************/

/* Build Table Structure */
CREATE TABLE public.account
(
	acc_id UUID NOT NULL,
	cli_id UUID NOT NULL,
	acc_balance BIGINT DEFAULT 0 NOT NULL,
	acc_credit BIGINT DEFAULT 50000000 NOT NULL,
	acc_state INTEGER DEFAULT 1 NOT NULL,
	acc_created_at TIMESTAMP DEFAULT NOW() NOT NULL,
	acc_updated_at TIMESTAMP NULL,
	acc_deleted_at TIMESTAMP NULL
);

/* Add Primary Key */
ALTER TABLE public.account ADD CONSTRAINT pkaccount
	PRIMARY KEY (acc_id);

/* Add Comments */
COMMENT ON COLUMN public.account.acc_state IS '1 = activado; 2 = desactivado; 3 = suspendido';

/* Add Indexes */
CREATE UNIQUE INDEX "account_cli_id_Idx" ON public.account USING btree (cli_id);


/******************** Add Table: public.app ************************/

/* Build Table Structure */
CREATE TABLE public.app
(
	app_id UUID NOT NULL,
	cli_id UUID NOT NULL,
	app_color VARCHAR(30) DEFAULT 'default' NOT NULL,
	app_created_at TIMESTAMP DEFAULT NOW() NOT NULL,
	app_updated_at TIMESTAMP NULL
);

/* Add Primary Key */
ALTER TABLE public.app ADD CONSTRAINT pkapp
	PRIMARY KEY (app_id);

/* Add Indexes */
CREATE UNIQUE INDEX "app_cli_id_Idx" ON public.app USING btree (cli_id);


/******************** Add Table: public.client ************************/

/* Build Table Structure */
CREATE TABLE public.client
(
	cli_id UUID NOT NULL,
	cli_full_name VARCHAR(500) NOT NULL,
	cli_email VARCHAR(500) NOT NULL,
	cli_phone VARCHAR(500) NOT NULL,
	cli_photo VARCHAR(500) NOT NULL,
	cli_state INTEGER DEFAULT 1 NOT NULL,
	cli_created_at TIMESTAMP DEFAULT NOW() NOT NULL,
	cli_updated_at TIMESTAMP NULL,
	cli_deleted_at TIMESTAMP NULL
);

/* Add Primary Key */
ALTER TABLE public.client ADD CONSTRAINT pkclient
	PRIMARY KEY (cli_id);

/* Add Comments */
COMMENT ON COLUMN public.client.cli_state IS '1 = activo; 2 = desactivo';

/* Add Indexes */
CREATE UNIQUE INDEX "client_cli_email_Idx" ON public.client USING btree (cli_email);

CREATE UNIQUE INDEX "client_cli_phone_Idx" ON public.client USING btree (cli_phone);


/******************** Add Table: public.movement ************************/

/* Build Table Structure */
CREATE TABLE public.movement
(
	mov_id UUID NOT NULL,
	acc_id_income UUID NOT NULL,
	acc_id_outcome UUID NOT NULL,
	mov_reason VARCHAR(500) NOT NULL,
	mov_amount BIGINT NOT NULL,
	mov_fees INTEGER DEFAULT 1 NOT NULL,
	mov_datetime TIMESTAMP DEFAULT NOW() NOT NULL
);

/* Add Primary Key */
ALTER TABLE public.movement ADD CONSTRAINT pkmovement
	PRIMARY KEY (mov_id);

/* Add Indexes */
CREATE INDEX "movement_acc_id_income_acc_id_outcome_Idx" ON public.movement USING btree (acc_id_income, acc_id_outcome);


/******************** Add Table: public.token ************************/

/* Build Table Structure */
CREATE TABLE public.token
(
	tok_id UUID NOT NULL,
	cli_id UUID NOT NULL,
	tok_token VARCHAR(500) NOT NULL,
	tok_fecha_expiracion TIMESTAMP NOT NULL
);

/* Add Primary Key */
ALTER TABLE public.token ADD CONSTRAINT pktoken
	PRIMARY KEY (tok_id);

/* Add Indexes */
CREATE INDEX "token_cli_id_Idx" ON public.token (cli_id);





/************ Add Foreign Keys ***************/

/* Add Foreign Key: fk_account_client */
ALTER TABLE public.account ADD CONSTRAINT fk_account_client
	FOREIGN KEY (cli_id) REFERENCES public.client (cli_id)
	ON UPDATE RESTRICT ON DELETE RESTRICT;

/* Add Foreign Key: fk_app_client */
ALTER TABLE public.app ADD CONSTRAINT fk_app_client
	FOREIGN KEY (cli_id) REFERENCES public.client (cli_id)
	ON UPDATE RESTRICT ON DELETE RESTRICT;

/* Add Foreign Key: fk_movement_account_income */
ALTER TABLE public.movement ADD CONSTRAINT fk_movement_account_income
	FOREIGN KEY (acc_id_income) REFERENCES public.account (acc_id)
	ON UPDATE RESTRICT ON DELETE RESTRICT;

/* Add Foreign Key: fk_movement_account_outcome */
ALTER TABLE public.movement ADD CONSTRAINT fk_movement_account_outcome
	FOREIGN KEY (acc_id_outcome) REFERENCES public.account (acc_id)
	ON UPDATE RESTRICT ON DELETE RESTRICT;

/* Add Foreign Key: fk_token_client */
ALTER TABLE public.token ADD CONSTRAINT fk_token_client
	FOREIGN KEY (cli_id) REFERENCES public.client (cli_id)
	ON UPDATE RESTRICT ON DELETE RESTRICT;
