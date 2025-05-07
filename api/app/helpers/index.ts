import type User from '#models/user'
import { RatingSummaryInput } from '../types/product_interface.js'

export const hasRole = (user: User | null, role: string): boolean => {
  if (!user || !user.roles) return false

  return user.roles.some((r) => r.slug === role)
}

export function buildRatingSummary(data: RatingSummaryInput) {
  const {
    totalRatings,
    averageRating,
    fiveStarCount,
    fourStarCount,
    threeStarCount,
    twoStarCount,
    oneStarCount,
  } = data

  const total = totalRatings || 1

  return {
    average_rating: averageRating,
    total_ratings: totalRatings,
    percentages: {
      five_star: ((fiveStarCount / total) * 100).toFixed(1),
      four_star: ((fourStarCount / total) * 100).toFixed(1),
      three_star: ((threeStarCount / total) * 100).toFixed(1),
      two_star: ((twoStarCount / total) * 100).toFixed(1),
      one_star: ((oneStarCount / total) * 100).toFixed(1),
    },
  }
}
