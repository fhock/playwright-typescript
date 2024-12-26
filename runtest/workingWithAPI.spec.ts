import {test, expect, request} from '@playwright/test'
import tags from '../test-data/tags.json'

test.beforeEach( async({page}) => {

    // For mock API
    await page.route('*/**/api/tags', async route => {
        await route.fulfill({
            body: JSON.stringify(tags)
        })
    })
    
    await page.goto('https://conduit.bondaracademy.com/')
    await page.waitForTimeout(1000);
})

test('has title', async ({page}) => {
    await page.route('*/**/api/articles*', async route => {
        const response = await route.fetch()  
        const responseBody = await response.json()
        responseBody.articles[0].title = "This is a MOCK test title"  
        responseBody.articles[0].description = "This is a MOCK description"

        await route.fulfill({
            body: JSON.stringify(responseBody)
        })
    })
    
    await page.getByText('Global Feed').click()    
    await expect(page.locator('.navbar-brand')).toHaveText('conduit')
    await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK test title')
    await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK description')
    await page.waitForTimeout(1000);
})

test('delete article with UI and create with API', async ({page, request}) => {
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user":{email: "pwdites@test.com", password: "Password1"}
        }
    })
    const responseBody = await response.json()
    const accessToken = responseBody.user.token

    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data:{
            "article":{"title":"TEST TITLE","description":"TEST DESCRIPTION","body":"TEST BODY","tagList":[]}
        },
        headers:{
            Authorization: `Token ${accessToken}`
        }
    })
    expect(articleResponse.status()).toEqual(201)

    await page.getByText('Global Feed').click()
    await page.getByText('TEST TITLE').click()
    await page.getByRole('button',{name: "Delete Article"}).first().click()

    await expect(page.locator('app-article-list h1').first()).not.toContainText('TEST TITLE')
})

test('create article with UI and delete with API', async ({page, request}) => {
    await page.getByText('New Article').click()
    await page.getByRole('textbox', {name: 'Article Title'}).fill('Playwright is awesome')
    await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill('About the Playwright')
    await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill('We like to use playwright for automation')
    await page.getByRole('button', {name: 'Publish Article'}).click()
    const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
    const articleResponseBody = await articleResponse.json()
    const sludId = articleResponseBody.article.slug

    await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome')
    await page.getByText('Home').click()
    await page.getByText('Global Feed').click()

    await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome')

    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user":{email: "pwdites@test.com", password: "Password1"}
        }
    })
    const responseBody = await response.json()
    const accessToken = responseBody.user.token

    const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${sludId}`, {
        headers:{
            Authorization: `Token ${accessToken}`
        }
    })
    expect(deleteArticleResponse.status()).toEqual(204)
})