-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT,
    "type" INTEGER NOT NULL,
    "description" TEXT,
    "id_user" TEXT NOT NULL,
    "id_category" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transactions" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "type" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "id_account" TEXT NOT NULL,
    "id_category" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Accounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "description" TEXT,
    "status" BOOLEAN NOT NULL,
    "id_user" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Goals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "descrioption" TEXT,
    "value" DOUBLE PRECISION NOT NULL,
    "color" TEXT,
    "status" BOOLEAN NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_category" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Limits" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "status" BOOLEAN NOT NULL,
    "notice" TEXT,
    "id_user" TEXT NOT NULL,
    "id_category" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Limits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "public"."Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_name_key" ON "public"."Accounts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_slug_key" ON "public"."Accounts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Goals_name_key" ON "public"."Goals"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Goals_slug_key" ON "public"."Goals"("slug");

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_id_category_fkey" FOREIGN KEY ("id_category") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transactions" ADD CONSTRAINT "Transactions_id_account_fkey" FOREIGN KEY ("id_account") REFERENCES "public"."Accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transactions" ADD CONSTRAINT "Transactions_id_category_fkey" FOREIGN KEY ("id_category") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transactions" ADD CONSTRAINT "Transactions_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Accounts" ADD CONSTRAINT "Accounts_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Goals" ADD CONSTRAINT "Goals_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Goals" ADD CONSTRAINT "Goals_id_category_fkey" FOREIGN KEY ("id_category") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Limits" ADD CONSTRAINT "Limits_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Limits" ADD CONSTRAINT "Limits_id_category_fkey" FOREIGN KEY ("id_category") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
