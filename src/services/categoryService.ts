import slugify from 'slugify'

import { Category } from '../models/categorySchema'
import { createHttpError } from '../util/createHTTPError'
import { CategoryInput } from '../types/categoryTypes'

export const findCategories = async (page = 1, limit = 3, search = '') => {
  const count = await Category.countDocuments()
  const totalPage = Math.ceil(count / limit)
  const searchRegExp = new RegExp('.*' + search + '.*', 'i')
  const filter = {
    $or: [{ name: { $regex: searchRegExp } }, { slug: { $regex: searchRegExp } }],
  }
  if (page > totalPage) {
    page = totalPage
  }
  const skip = (page - 1) * limit

  const categories = await Category.find(filter).skip(skip).limit(limit).sort({ name: 1 })
  return {
    categories,
    totalPage,
    currentPage: page,
  }
}

export const findCtegoryById = async (id: string): Promise<CategoryInput> => {
  const category = await Category.findById(id)
  if (!category) {
    const error = createHttpError(404, 'Category not found')
    throw error
  }
  return category
}

export const findCtegoryBySlug = async (slug: string): Promise<CategoryInput> => {
  const category = await Category.findOne({ slug: slug })
  if (!category) {
    const error = createHttpError(404, 'Category not found')
    throw error
  }
  return category
}

export const updateCategoryById = async (
  id: string,
  updatedCategoryDate: CategoryInput
): Promise<CategoryInput> => {
  if (updatedCategoryDate.name) {
    updatedCategoryDate.slug = slugify(updatedCategoryDate.name)
  }
  const updatedCategory = await Category.findByIdAndUpdate(id, updatedCategoryDate, { new: true })
  if (!updatedCategory) {
    const error = createHttpError(404, 'Category not found')
    throw error
  }
  return updatedCategory
}

export const updateCategoryBySlug = async (
  slug: string,
  updatedCategoryDate: CategoryInput
): Promise<CategoryInput> => {
  if (updatedCategoryDate.name) {
    updatedCategoryDate.slug = slugify(updatedCategoryDate.name)
  }
  const updatedCategory = await Category.findOneAndUpdate({ slug: slug }, updatedCategoryDate, {
    new: true,
  })
  if (!updatedCategory) {
    const error = createHttpError(404, 'Category not found')
    throw error
  }
  return updatedCategory
}

export const deleteCategoryById = async (id: string) => {
  const category = await Category.findByIdAndDelete(id)
  if (!category) {
    const error = createHttpError(404, 'Category not found')
    throw error
  }
  return category
}

export const deleteCategoryBySlug = async (slug: string) => {
  const category = await Category.findOneAndDelete({ slug: slug })
  if (!category) {
    const error = createHttpError(404, 'Category not found')
    throw error
  }
  return category
}
