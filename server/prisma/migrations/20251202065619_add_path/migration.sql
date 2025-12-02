-- CreateTable
CREATE TABLE "cctvs" (
    "id" SERIAL NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cctvs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lights" (
    "id" SERIAL NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrimeData" (
    "id" SERIAL NOT NULL,
    "district" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrimeData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "path_histories" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,
    "startName" TEXT NOT NULL,
    "endName" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "path_histories_pkey" PRIMARY KEY ("id")
);
