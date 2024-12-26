import {test, expect, request} from '@playwright/test'
import tags from '../test-data/tags.json'
import { REFUSED } from 'dns'

test.beforeEach( async({page}) => {

    // For mock API
    await page.route('*/**/api/tags', async route => {
        await route.fulfill({
            body: JSON.stringify(tags)
        })
    })
    
    await page.goto('https://conduit.bondaracademy.com/')
    await page.waitForTimeout(1000);

    // For perform API request
    await page.getByText('Sign in').click()
    await page.getByRole('textbox', {name: "Email"}).fill('pwdites@test.com')
    await page.getByRole('textbox', {name: "Password"}).fill('Password1')
    await page.getByRole('button').click()
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

test('delete article', async ({page, request}) => {
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
