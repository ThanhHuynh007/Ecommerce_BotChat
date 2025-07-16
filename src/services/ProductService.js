const Product = require("../models/ProductModel")

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description, discount } = newProduct
        try {
            const checkProduct = await Product.findOne({ 
                name: name
            });
            if (checkProduct !== null) {
                return resolve({
                    status: 'ERR',
                    message: 'The name of product is already'
                });
            }
            
            const newProduct = await Product.create({
                name, 
                image, 
                type, 
                price, 
                countInStock: Number(countInStock), 
                rating, 
                description,
                discount: Number(discount),
            });

            if (newProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: newProduct
                });
            }

        } catch (e) {
            console.error('Error in createUser:', e);
            return reject(e);
        }
    });
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if(checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }
            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedProduct
              })
            
        } catch(e) {
            reject(e)
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if(checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }
            await Product.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete success'
              })
            
        } catch(e) {
            reject(e)
        }
    })
}

const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete success'
              })
            
        } catch(e) {
            reject(e)
        }
    })
}

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const safeLimit = Number(limit);
            const safePage = Number(page);

            let sortOption = {};
            if (sort) {
                const [field, order] = sort.split(':');
                if (field && ['name', 'price', 'rating'].includes(field) && ['asc', 'desc'].includes(order)) {
                    sortOption[field] = order === 'asc' ? 1 : -1;
                } else {
                    return resolve({
                        status: 'ERR',
                        message: 'Tham số sort không hợp lệ. Sử dụng định dạng: field:order (ví dụ: price:asc, name:desc)',
                    });
                }
            }

            let filterOption = {};
            if (Array.isArray(filter)) {
                // Xử lý ?filter=name&filter=<search_term>
                const filterType = filter[0];
                const filterValue = filter[1];
                if (filterType === 'name' && filterValue) {
                    filterOption.name = { $regex: filterValue, $options: 'i' };
                }
            } else if (typeof filter === 'string') {
                // Xử lý giá trị filter đơn (ví dụ: ?filter=Soi Nylon)
                filterOption.name = { $regex: filter, $options: 'i' };
            } else if (filter && typeof filter === 'object') {
                // Xử lý filter dạng object (ví dụ: filter[type]=Soi)
                if (filter.type) {
                    filterOption.type = filter.type;
                }
                if (filter.name) {
                    filterOption.name = { $regex: filter.name, $options: 'i' };
                }
                if (filter.minPrice || filter.maxPrice) {
                    filterOption.price = {};
                    if (filter.minPrice && !isNaN(Number(filter.minPrice))) {
                        filterOption.price.$gte = Number(filter.minPrice);
                    }
                    if (filter.maxPrice && !isNaN(Number(filter.maxPrice))) {
                        filterOption.price.$lte = Number(filter.maxPrice);
                    }
                }
            }

            const totalProduct = await Product.countDocuments(filterOption);
            const query = Product.find(filterOption)
                .limit(safeLimit)
                .skip(safePage * safeLimit);

            if (Object.keys(sortOption).length > 0) {
                query.sort(sortOption);
            }

            const allProduct = await query.exec();

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allProduct,
                total: totalProduct,
                pageCurrent: safePage + 1,
                limit: safeLimit,
            });
        } catch (e) {
            console.error('Lỗi trong getAllProduct service:', e);
            reject(new Error(`Không thể lấy sản phẩm: ${e.message}`));
        }
    });
};

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id
            })
            if(product === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }
            
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: product
              })
            
        } catch(e) {
            reject(e)
        }
    })
}

const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct('type')
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allType,
            });
        } catch (e) {
            reject(new Error(`Không thể lấy sản phẩm: ${e.message}`));
        }
    });
};

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    deleteManyProduct,
    getAllProduct,
    getAllType,
}