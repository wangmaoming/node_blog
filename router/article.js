/**
 * 文章子应用
 */
const express = require('express')
const article = require('../middleware/article')
const category = require('../middleware/category')
const auth = require('../middleware/auth')

// 文章子应用
const articleApp = express()

articleApp.use(category.getList, auth.getUser)

// 文章列表页
articleApp.get('/list/:id',article.getLeiCount, (req, res, next) => {
    let { articleCount } = req

    let size = 8 // 每页显示5条
    req.page = {}
    req.page.count = articleCount
    req.page.total = Math.ceil(req.page.count / size)
    req.page.p = req.query.p ? req.query.p : 1
    req.page.p = req.page.p > req.page.total ? req.page.total : req.page.p
    req.page.p = req.page.p < 1 ? 1 : req.page.p

    res.start = (req.page.p - 1) * size
    res.size = size

    next()

},  [article.getListByCategoryId, category.getCategoryById], (req, res) => {
    let { page,articles, categories, category, user } = req
    res.render('list', {  page: page,articles: articles, categories: categories, category: category, user: user })
})

// 文章详情页
articleApp.get('/:id', [article.getArticleById, article.getTabs, article.getPrev, article.getNext], (req, res) => {
    let { article, categories, tabs, prev, next, user } = req
    res.render('article', { article: article, categories: categories, tabs: tabs, prev: prev, next: next, user: user })
})


module.exports = articleApp