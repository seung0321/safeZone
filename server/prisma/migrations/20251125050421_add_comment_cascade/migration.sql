-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_bordId_fkey";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_bordId_fkey" FOREIGN KEY ("bordId") REFERENCES "Bord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
