import {Category, Meal} from './types';

export async function getCategories() {
  const res = await fetch(
    'https://www.themealdb.com/api/json/v1/1/categories.php',
  );

  if (!res.ok) {
    throw new Error('An error occurred');
  }

  const json = await res.json();

  return (json as {categories: Array<Category>}).categories;
  // return [];
}

export async function getMealsByCategory(
  category: Category['strCategory'],
): Promise<Array<Meal>> {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
  );

  if (!res.ok) {
    throw new Error('An error occurred while fetching categories');
  }

  const json = await res.json();

  return (json as {meals: Array<Meal>}).meals;
}
