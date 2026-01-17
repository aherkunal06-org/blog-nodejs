/**
 * @typedef {Object} Author
 * @property {string} username
 * @property {string} [name]
 */

/**
 * @typedef {Object} BlogCard
 * @property {number} id
 * @property {string} title
 * @property {string} slug
 * @property {string|null} image
 * @property {string|null} metaDescription
 * @property {string|null} [metaKeywords]
 * @property {string} [updatedAt]
 * @property {Author} author
 */

/**
 * @typedef {Object} BlogWrapper
 * @property {BlogCard} blog
 */

/**
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} name
 * @property {string|null} image
 * @property {BlogWrapper[]} blogs
 */

/**
 * @typedef {Object} BlogsApiResponse
 * @property {Category[]} categories
 * @property {number} totalPages
 * @property {number} currentPage
 */

// Export types for JSDoc usage
export {};


