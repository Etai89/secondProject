$(document).ready(async () => {

    const getCoins = async () => {
        const coins = await $.ajax('https://api.coingecko.com/api/v3/coins/list')
        coins.splice(0, coins.length - 100)
        return coins
    }
    const getExpensiveCoins = async () => {
        const url = 'https://api.coingecko.com/api/v3/coins/markets'
        const params = {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1
        }
        const coins = await $.ajax(url, { data: params })
        return coins
    }

    const getSpecificCoinData = async (coinId) => {
        try {
            if (localStorage.getItem(coinId)) {
                const savedData = JSON.parse(localStorage.getItem(coinId))
                const lastUpdated = new Date(savedData.lastUpdated)
                const twoMinutes = 2 * 60 * 1000
                const difference = Math.abs(new Date() - lastUpdated)
                if (difference <= twoMinutes) {
                    console.log('data from localstorage')
                    return savedData.coinData
                }
            }

            console.log('new API request')
            const coinData = await $.ajax(`https://api.coingecko.com/api/v3/coins/${coinId}`)
            const lastUpdated = new Date()
            localStorage.setItem(
                coinId,
                JSON.stringify({
                    coinData,
                    lastUpdated,
                })
            )
            return coinData
        } catch (error) {
            console.error(`Error fetching data for coin ID "${coinId}":`, error)
            return null
        }
    }

    const showSelectedCoinsInModal = () => {
        const selectedCoins = []
        let html = ''
        $('.checkbox:checked').each((index, el) => {
            const coinId = $(el).attr('coinid')
            const coinName = ''
            const coinPrice = ''
            html += `
            <div class= "selectedCoins">
            <p>${coinId}</p> 

            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" coinid=${coinId} id="flexSwitchCheckChecked" checked>
            </div>
            </div>
            `
        })
        $('.modal-body').html(html)
    }

    // show/hide pages
    $('.link').on('click', (event) => {
        const page = $(event.target).attr('pageTitle')
        $('.page').hide()
        $('.' + page).show('slow')
    })

    // prin out all the coins in a grid
    const coins = await getExpensiveCoins()
    let html = ''
    coins.map((coin) => {
        html += `
        <div class="coin">
        <div>
        <h3>${coin.name}</h3>


        <div class="form-check form-switch">
            <input class="form-check-input checkbox" type="checkbox" role="switch" coinid="${coin.id}" id="flexSwitchCheckChecked">
        </div>

        </div>
        <button id=${coin.id}>More info</button>
        </div>
        `
    })
    $('.currencies').html(html)

    // get more info per coins
    $('.coin button').on('click', async (event) => {

        if ($(event.target).text() === 'Hide') {
            $(event.target).parent().find('.moreInfo, img').hide('slow')
            $(event.target).text('More Info')

        } else {

            const id = event.target.id
            $(event.target).text('Loading...')
            const coinData = await getSpecificCoinData(id)

            $(event.target).text('Hide')

            const { ils, eur, usd } = coinData.market_data.current_price

            let html = `<div class="moreInfo">
            
            <p>ILS: ₪${ils}</p>
            <p>EUR: €${eur}</p>
            <p>USD: $${usd}</p>
            </div>`
            $(event.target).parent().append(html)
            $(event.target).parent().prepend(`<img src=${coinData.image.thumb} alt="${coinData.name}"/>`)

        }
    })



    $('.checkbox').on('click', (event) => {
        const checkedChecboxes = $('.checkbox:checked').length
        if (checkedChecboxes ===2) {
            event.preventDefault()
            $(event.target).prop('checked', false)
            $('#exampleModal').modal('show')
            showSelectedCoinsInModal()

        }
        const coinId = $(event.target).attr('coinid')

    })
    // get more info per coins
    $('.coin button').on('click', async (event) => {

        if ($(event.target).text() === 'Hide') {
            $(event.target).parent().find('.moreInfo, img').hide('slow')
            $(event.target).text('More Info')

        } else {

            const id = event.target.id
            $(event.target).text('Loading...')
            const coinData = await getSpecificCoinData(id)

            $(event.target).text('Hide')

            const { ils, eur, usd } = coinData.market_data.current_price

            let html = `<div class="moreInfo">
                
                <p>ILS: ₪${ils}</p>
                <p>EUR: €${eur}</p>
                <p>USD: $${usd}</p>
                </div>`
            $(event.target).parent().append(html)
            $(event.target).parent().prepend(`<img src=${coinData.image.thumb} alt="${coinData.name}"/>`)

        }
    })
})
