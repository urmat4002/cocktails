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
const GET_THE_INGREDIENT = API + 'filter.php?i='

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
  //console.log(response)
  renderCocktails(response.drinks, false)
}

const renderCocktails = (drinks, displayIng) => {
  // console.log(drinks)
  output.innerHTML = ''
  drinks
    ? drinks.map((el) => {
        const card = document.createElement('div')
        const img = document.createElement('img')
        const title = document.createElement('h2')
        const ingredients = document.createElement('div')

        if (displayIng) {
          /*const ingredient1 = document.createElement('p')
          const ingredient2 = document.createElement('p')
          const ingredient3 = document.createElement('p')
          const ingredient4 = document.createElement('p')

          ingredient1.textContent = el.strIngredient1
          ingredient2.textContent = el.strIngredient2
          ingredient3.textContent = el.strIngredient3
          ingredient4.textContent = el.strIngredient4

          ingredient1.addEventListener('click', () => {
            getIngredient(el.strIngredient1)

          })*/

          ingredients.innerHTML = '<h4>Ingredients:</h4>'
          for (let i = 0; i < 4; i++) {
            const ingredient = document.createElement('p')
            for (let obj in el) {
              if (obj === `strIngredient${i}`) ingredient.textContent = el[obj]
            }

            ingredient.style.cursor = 'pointer'
            ingredients.append(ingredient)
            ingredient.addEventListener('click', () => {
              getIngredient(ingredient.textContent)
            })
          }

          //ingredients.append(ingredient1, ingredient2, ingredient3, ingredient4)
          //console.log(el.strGlass)
        }

        img.src = el.strDrinkThumb
        img.style.width = '200px'
        img.style.height = '200px'
        card.style.maxWidth = '250px'
        title.textContent = el.strDrink
        card.className = 'card'

        img.addEventListener('click', () => {
          getSelected(el)
        })
        title.addEventListener('click', () => {
          getSelected(el)
        })

        card.append(img, title, ingredients)
        output.append(card)
      })
    : (output.innerHTML = `<h1>Server error</h1>`)
}

form.addEventListener('submit', (e) => e.preventDefault())
input.addEventListener('keyup', () => getByName())
select.addEventListener('change', getFiltered)

getAllCocktails()
