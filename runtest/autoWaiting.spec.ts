import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
})

test('auto waiting', async ({page})=> {
    const sucessButton = page.locator('.bg-success')
    
    // await sucessButton.click()

    // const text = await sucessButton.textContent()
    await sucessButton.waitFor({state: "attached"})
    // const text = await sucessButton.allTextContents()

    // expect(text).toContain('Data loaded with AJAX get request')

    await expect(sucessButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test('alternatice waits', async ({page}) => {
    const sucessButton = page.locator('.bg-success')

    // ___ wait for element
    await page.waitForSelector('.bg-success')

    // ___ wait for particular response
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // ___ wait for network calls to be completed ('NOT RECOMMENDED')
    await page.waitForLoadState('networkidle')

    await page.waitForTimeout(5000)

    await page.waitForURL('http://uitestingplayground.com/ajaxdata')

    const text = await sucessButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})