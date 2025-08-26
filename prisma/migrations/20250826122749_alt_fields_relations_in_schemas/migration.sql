/*
  Warnings:

  - A unique constraint covering the columns `[id_user,name]` on the table `Accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_user,name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_user,name]` on the table `Goals` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Accounts_id_user_name_key" ON "public"."Accounts"("id_user", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_id_user_name_key" ON "public"."Category"("id_user", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Goals_id_user_name_key" ON "public"."Goals"("id_user", "name");
