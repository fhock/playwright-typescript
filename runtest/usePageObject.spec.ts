import {test, expect} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'


test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})

test('navigation to form page', async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods', async({page})=> {
    const pm = new PageManager(page)    
    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialAndSelectOption('test@test.com', 'Password123', 'Option 2')
    await pm.onFormLayoutsPage().submitInLineFormWithNameEmailAndCheckbox('John Smith', 'john@test.com', false)
    await pm.navigateTo().datepickerPage()
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(5)
    await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(6, 15)
})