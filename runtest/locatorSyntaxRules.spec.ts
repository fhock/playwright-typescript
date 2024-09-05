import {test} from '@playwright/test'

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