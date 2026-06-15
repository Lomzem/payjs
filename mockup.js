function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
        // Check immediately first
        const existing = document.querySelector(selector)
        if (existing) {
            resolve(existing)
            return
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector)
            if (element) {
                observer.disconnect()
                clearTimeout(timer)
                resolve(element)
            }
        })

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        })

        const timer = setTimeout(() => {
            observer.disconnect()
            reject(new Error(`Element not found: ${selector}`))
        }, timeout)
    })
}

function waitForCondition(fn, timeout = 10000, interval = 100) {
    return new Promise((resolve, reject) => {
        const start = Date.now()

        const check = () => {
            const result = fn()
            if (result) {
                resolve(result)
                return
            }

            if (Date.now() - start > timeout) {
                reject(new Error("Condition timed out"))
                return
            }

            setTimeout(check, interval)
        }

        check()
    })
}

async function waitForStableDom(stableMs = 150) {
    return new Promise(resolve => {
        let timer

        const observer = new MutationObserver(() => {
            clearTimeout(timer)
            timer = setTimeout(finish, stableMs)
        })

        function finish() {
            observer.disconnect()
            resolve()
        }

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
        })

        timer = setTimeout(finish, stableMs)
    })
}


async function fillDate(date, code) {
    const dateCell = await waitForCondition(() =>
        Array.from(document.querySelectorAll("td")).find(div => div.textContent.includes(date) && Array.from(div.classList).some(c => c.includes("wide")))
    )
    const dateRow = dateCell.parentElement

    const hoursCell = dateRow.querySelector(".timesheet-duration-col")
    const hoursInput = hoursCell.querySelector("input")

    hoursInput.value = "8"

    hoursInput.dispatchEvent(new Event("change"))
    hoursInput.dispatchEvent(new Event("blur"))

    const orgCell = dateRow.querySelector(".timesheet-org-header-col")
    orgCell.querySelector("button").click()

    let jobCostBtn = await waitForElement("div#jc-option-selector")
    jobCostBtn.click()

    const inputFieldContainer = await waitForElement("div.input-field-container")
    const inputField = inputFieldContainer.querySelector("input")
    inputField.value = code
    inputField.dispatchEvent(new Event("change"), { bubbles: true })
    await waitForStableDom()

    const job = await waitForCondition(() =>
        Array.from(document.querySelectorAll("div.option-list-item"))
            .find(el => el.innerText.includes(code))
    )

    await waitForStableDom()
    job.click()

    const saveBtn = await waitForCondition(() =>
        Array.from(document.querySelectorAll("button")).find(el => el.innerText.includes("Save"))
    )
    await waitForStableDom()
    saveBtn.click()
}

const editBtn = document.querySelector("button[text='Edit']")
if (editBtn) {
    editBtn.click()
}
await waitForStableDom()

await fillDate("Jun 8", "5177")
await fillDate("Jun 9", "5177")
await fillDate("Jun 10", "5177")
await fillDate("Jun 11", "5177")
await fillDate("Jun 12", "5177")
await fillDate("Jun 15", "5177")
await fillDate("Jun 16", "5177")
await fillDate("Jun 17", "5177")
await fillDate("Jun 18", "5177")



