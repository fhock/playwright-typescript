import {test} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})

test.describe('suite1', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
    })

    test('the first test', async ({page}) => {
        await page.getByText('Form layout').click()
    })

    test('navigate to datepicker page', async ({page}) => {
        await page.getByText('Form layout').click()
    })
})