import { Request, NextFunction, Response } from 'express'
import mongoose from 'mongoose'

import { createHttpError } from '../util/createHTTPError'
import {
  deleteCategoryById,
  deleteCategoryBySlug,
  findCategories,
  findCtegoryById,
  findCtegoryBySlug,
  updateCategoryById,
  updateCategoryBySlug,
} from '../services/categoryService'
import { CategoryInput } from '../types/categoryTypes'
import { handleCastError } from '../util/handelMongoID'
import slugify from 'slugify'
import { Category } from '../models/categorySchema'

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 18
    const search = req.query.search as string
    const { categories, totalPage, currentPage } = await findCategories(page, limit, search)
    res.status(200).json({
      massege: 'return all Categorie ',
      payload: categories,
      totalPage,
      currentPage,
    })
  } catch (error) {
    next(error)
  }
}

export const getSingleCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const category = await findCtegoryById(id)
    
    res.status(200).json({
      massege: 'return single Category',
      payload: category,
    })
  } catch (error) {
    handleCastError(error, next)
  }
}

export const getSingleCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params
    const category = await findCtegoryBySlug(slug)
    res.status(200).json({
      massege: 'return single Category',
      payload: category,
    })
  } catch (error) {
    next(error)
  }
}

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body
    const categoryExist = await Category.exists({ name: name })

    if (categoryExist) {
      const error = createHttpError(409, 'Category already exists with this name')
      throw error
    }

    const newCategory = new Category({
      name,
      slug: slugify(name),
    })

    const category = await newCategory.save()

    res.status(201).send({
      message: 'The category has been created successfully',
      payload: category,
    })
  } catch (error) {
    next(error)
  }
}


export const updateSingleCategoryId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const updatedCategory: CategoryInput = req.body
    const updated = await updateCategoryById(id, updatedCategory)
    res.status(200).json({
      massege: 'The category has been updated successfully ',
      payload: updated,
    })
  } catch (error) {
    handleCastError(error, next)
  }
}

export const updateSingleCategoryBySulg = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params
    const updatedCategory: CategoryInput = req.body
    const updated = await updateCategoryBySlug(slug, updatedCategory)
    res.status(200).json({
      massege: 'The category has been updated successfully ',
      payload: updated,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteSingleCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    await deleteCategoryById(id)
    res.status(200).json({
      massege: 'The category has been deleted successfully',
    })
  } catch (error) {
    handleCastError(error, next)
  }
}

export const deleteSingleCategoryBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params
    await deleteCategoryBySlug(slug)
    res.status(200).json({
      massege: 'The category has been deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}
