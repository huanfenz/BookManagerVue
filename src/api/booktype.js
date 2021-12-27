import request from '@/utils/request'

// 获取图书类型数量
export function getCount() {
    return request({
        url: '/bookType/getCount',
        method: 'get'
    })
}

// 查询所有图书类型
export function queryBookTypes() {
    return request({
        url: '/bookType/queryBookTypes',
        method: 'get'
    })
}

// 分页查询图书类型
export function queryBookTypesByPage(params) {
    return request({
        url: '/bookType/queryBookTypesByPage',
        method: 'get',
        params
    })
}

// 添加图书类型
export function addBookType(data) {
    return request({
        url: '/bookType/addBookType',
        method: 'post',
        data
    })
}

// 删除图书类型
export function deleteBookType(data) {
    return request({
        url: '/bookType/deleteBookType',
        method: 'delete',
        data
    })
}

//  删除一些图书类型
export function deleteBookTypes(data) {
    return request({
        url: '/bookType/deleteBookTypes',
        method: 'delete',
        data
    })
}

//  更新图书类型
export function updateBookType(data) {
    return request({
        url: '/bookType/updateBookType',
        method: 'put',
        data
    })
}
