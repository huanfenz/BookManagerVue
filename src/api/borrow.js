import request from '@/utils/request'

// 获取借阅数量
export function getCount() {
    return request({
        url: '/borrow/getCount',
        method: 'get'
    })
}

// 查询所有借阅信息
export function queryBorrows() {
    return request({
        url: '/borrow/queryBorrows',
        method: 'get'
    })
}

// 分页查询借阅信息
export function queryBorrowsByPage(params) {
    return request({
        url: '/borrow/queryBorrowsByPage',
        method: 'get',
        params
    })
}

// 添加借阅信息
export function addBorrow(data) {
    return request({
        url: '/borrow/addBorrow',
        method: 'post',
        data
    })
}

// 删除借阅信息
export function deleteBorrow(data) {
    return request({
        url: '/borrow/deleteBorrow',
        method: 'delete',
        data
    })
}

//  删除一些借阅信息
export function deleteBorrows(data) {
    return request({
        url: '/borrow/deleteBorrows',
        method: 'delete',
        data
    })
}

//  更新借阅信息
export function updateBorrow(data) {
    return request({
        url: '/borrow/updateBorrow',
        method: 'put',
        data
    })
}

// 借书
export function borrowBook(userid, bookid) {
    return request({
        url: '/borrow/borrowBook',
        method: 'post',
        params: {
            userid,
            bookid
        }
    })
}

// 还书
export function returnBook(borrowid, bookid) {
    return request({
        url: '/borrow/returnBook',
        method: 'post',
        params: {
            borrowid,
            bookid
        }
    })
}
