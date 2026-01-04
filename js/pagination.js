class ProductManager {
  constructor() {
    this.allProducts = [...PRODUCTS_DATA]; // نسخة من البيانات الأصلية
    this.filteredProducts = [...PRODUCTS_DATA];
    this.filters = {
      category: '',
      sort: 'newest',
      search: ''
    };
  }
  
  // تطبيق الفلاتر
  applyFilters() {
    let products = [...this.allProducts];
    
    // Filter by category
    if (this.filters.category) {
      products = products.filter(p => p.category === this.filters.category);
    }
    
    // Filter by search
    if (this.filters.search) {
      const searchLower = this.filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort products
    switch(this.filters.sort) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        products.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'newest':
      default:
        products.sort((a, b) => b.id - a.id);
    }
    
    this.filteredProducts = products;
  }
  
  // جلب صفحة معينة
  getPage(page, limit = 12) {
    this.applyFilters();
    
    const totalItems = this.filteredProducts.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const pageProducts = this.filteredProducts.slice(startIndex, endIndex);
    
    return {
      data: pageProducts,
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit
    };
  }
  
  // تحديث الفلاتر
  updateFilters(newFilters) {
    this.filters = { ...this.filters, ...newFilters };
  }
}
// Pagination Class
class Pagination {
  constructor(config) {
    this.currentPage = 1;
    this.totalPages = 1;
    this.onPageChange = config.onPageChange || (() => {});
    this.maxVisible = config.maxVisible || 5;
  }
  
  setTotalPages(total) {
    this.totalPages = total;
  }
  
  setCurrentPage(page) {
    this.currentPage = page;
  }
  
  getPageNumbers() {
    const pages = [];
    const { currentPage, totalPages, maxVisible } = this;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);
      
      if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  }
  
  
