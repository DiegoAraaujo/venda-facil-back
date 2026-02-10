import { PrismaClient } from "@prisma/client";
import { Review } from "../types/review";

const prisma = new PrismaClient();

export const countReviewsByStore = (storeId: number) => {
  return prisma.review.count({ where: { store_id: storeId } });
};

export const sumRatingByStore = (storeId: number) => {
  return prisma.review.aggregate({
    _sum: {
      rating: true,
    },
    where: {
      store_id: storeId,
    },
  });
};

export const findReviewsByStore = (
  storeId: number,
  skip: number,
  take: number
) => {
  return prisma.review.findMany({
    where: {
      store_id: storeId,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      author_name: true,
      profile_photo: true,
      created_at: true,
    },
    skip,
    take,
    orderBy: {
      id: "asc",
    },
  });
};

export const getRatingDistribution = (storeId: number) => {
  return prisma.review.groupBy({
    by: ["rating"],
    _count: { rating: true },
    where: { store_id: storeId },
  });
};

export const createReviewByStore = (storeId: number, review: Review) => {
  return prisma.review.create({
    data: { store_id: storeId, ...review },
    select: {
      id: true,
      rating: true,
      comment: true,
      author_name: true,
      profile_photo: true,
      created_at: true,
    },
  });
};

export const findLatestReviews = (storeId: number) => {
  return prisma.review.findMany({
    where: {
      store_id: storeId,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      author_name: true,
      profile_photo: true,
      created_at: true,
    },
    orderBy: { created_at: "desc" },
    take: 3,
  });
};
