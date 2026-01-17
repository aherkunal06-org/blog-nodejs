/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 * @property {string|null} image
 * @property {number|null} price
 * @property {number|null} salePrice
 * @property {string|null} description
 * @property {string|null} category
 * @property {string} ipshopyUrl
 * @property {"active"|"inactive"} status
 * @property {number} rating
 * @property {number} reviewCount
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} BlogProduct
 * @property {number} id
 * @property {number} blogId
 * @property {number} productId
 * @property {"featured"|"mentioned"|"related"|"comparison"} linkType
 * @property {number} position
 * @property {Product} [product]
 */

// Export types for JSDoc usage
export {};


