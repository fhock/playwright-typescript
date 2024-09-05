import {test} from '@playwright/test'
import { __await } from 'tslib'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form layout').click()
})

test('Locator syntax rules', async({page}) => {
    //by Tag name
    page.locator('input')

    //by ID
    page.locator('#inputEmail')

    //by Class value
    page.locator('.shape-rectangle')

    //by attribute
    page.locator('[placeholder="Email"]')

    //by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //combine different selectors (combine without space)
    page.locator('input[placeholder="Email"].shape-rectangle[nbinput]')

    //by XPath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail"]')

    //by partial text match
    page.locator(':text("Using)')

    //by exact text match
    page.locator(':text-is("Using the Grid")')

})

// the locators for user-facing locators can be generate using playwright Codegen
test('User facing locators', async ({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').click()

    await page.getByTestId('SignIn').click()

    await page.getByTitle('IoT Dashboard').click()
})