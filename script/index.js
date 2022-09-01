const form = document.querySelector('form')
const input = document.getElementById('inp')
const btn = document.getElementById('btn')
const select = document.getElementById('select')
const output = document.getElementById('output')

const API = 'https://www.thecocktaildb.com/api/json/v1/1/'
const GET_ALL_COCKTAILS = API + 'filter.php?c=Cocktail'
const GET_BY_NAME = API + 'search.php?s='
const GET_FYLTER = API + 'filter.php?a='
const GET_INGREDIENTS = API + 'lookup.php?i='
const GET_THE_INGREDIENT = API + 'search.php?i='

const getAllCocktails = async () => {
  const request = await fetch(GET_ALL_COCKTAILS)
  const response = await request.json()
  //console.log(response.drinks)
  renderCocktails(response.drinks, false)
}

const getByName = async () => {
  let request = ''
  if (input.value.length > 2) {
    request = await fetch(GET_BY_NAME + input.value)
  } else {
    request = await fetch(GET_ALL_COCKTAILS)
  }
  const response = await request.json()

  renderCocktails(response.drinks, false)
}

const getFiltered = async () => {
  const request = await fetch(GET_FYLTER + select.value)
  const response = await request.json()
  //console.log(response)
  renderCocktails(response.drinks, false)
}

const getSelected = async (item) => {
  const request = await fetch(GET_INGREDIENTS + item.idDrink)
  const response = await request.json()
  //console.log(response.drinks)

  renderCocktails(response.drinks, true)
}

const getIngredient = async (ingredient) => {
  const request = await fetch(GET_THE_INGREDIENT + ingredient)
  const response = await request.json()
  // console.log(response.ingredients[0])

  renderIngDescription(response.ingredients[0])
}

const renderIngDescription = (data) => {
  output.innerHTML = ''
  const img = document.createElement('img')

  const cardDesc = document.createElement('div')
  const title = document.createElement('h2')
  title.textContent = data.strIngredient
  cardDesc.className = 'cardDesc'
  const desc = document.createElement('p')
  img.src = `https://thecocktaildb.com/images/ingredients/${title.textContent}-Small.png`

  desc.textContent =
    data.strDescription == null ? 'Описание отсутствует' : data.strDescription

  cardDesc.append(title, img, desc)
  output.append(cardDesc)

  //console.log(data.strDescription)
}

const renderCocktails = (drinks, displayIng) => {
  // console.log(drinks)
  output.innerHTML = ''
  //console.log(drinks)
  drinks
    ? drinks.map((el) => {
        const card = document.createElement('div')
        const img = document.createElement('img')
        const title = document.createElement('h2')
        const ingredients = document.createElement('div')
        const cockDesc = document.createElement('p')

        // console.log(el)

        if (displayIng) {
          ingredients.innerHTML = '<h4>Ingredients:</h4>'
          for (let i = 0; i < 4; i++) {
            const ingredient = document.createElement('p')
            for (let obj in el) {
              if (obj === `strIngredient${i}`) ingredient.textContent = el[obj]
            }

            ingredient.style.cursor = 'pointer'
            ingredients.append(ingredient)
            ingredient.addEventListener('click', () => {
              event.stopPropagation()
              getIngredient(ingredient.textContent)
            })
          }
        }

        cockDesc.textContent = el.strIBA
        img.src = el.strDrinkThumb
        img.style.width = '200px'
        img.style.height = '200px'
        card.style.maxWidth = '250px'
        title.textContent = el.strDrink
        card.className = 'card'

        card.addEventListener('click', () => {
          getSelected(el)
        })

        card.append(img, title, cockDesc, ingredients)
        output.append(card)
      })
    : (output.innerHTML = `<h1>Server error</h1>`)
}

form.addEventListener('submit', (e) => e.preventDefault())
input.addEventListener('keyup', () => getByName())
select.addEventListener('change', getFiltered)

getAllCocktails()
