function generateDrink() {
    const body = document.getElementById('body');
    body.classList.add('shake'); // Trigger the shake effect
    setTimeout(() => body.classList.remove('shake'), 500); // Remove the shake effect after it plays

    const flavor = document.getElementById('flavor').value;
    const alcohol = document.getElementById('alcohol').value;
    const mixer = document.getElementById('mixer').value;

    if (flavor && alcohol && mixer) {
        // Fetch drinks based on the chosen alcohol type
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${alcohol}`)
            .then(response => response.json())
            .then(data => {
                console.log(data); // Log the response to see what you get
                const drinks = data.drinks;

                if (drinks && drinks.length > 0) {
                    // Randomly choose a drink from the list
                    const randomIndex = Math.floor(Math.random() * drinks.length);
                    const drink = drinks[randomIndex];

                    // Fetch full drink details by its ID
                    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drink.idDrink}`)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data); // Log the full drink details
                            const fullDrink = data.drinks[0];
                            displayDrink(fullDrink);
                        })
                        .catch(error => {
                            console.error('Error fetching full drink details:', error);
                            document.getElementById('drink-result').innerHTML = `Error fetching full drink details.`;
                        });
                } else {
                    document.getElementById('drink-result').innerHTML = `No drinks found matching your criteria.`;
                }
            })
            .catch(error => {
                console.error('Error fetching drinks:', error);
                document.getElementById('drink-result').innerHTML = `Error fetching drinks.`;
            });
    } else {
        document.getElementById('drink-result').innerHTML = `Please select all fields.`;
    }
}

function randomDrink() {
    const body = document.getElementById('body');
    body.classList.add('shake'); // Trigger the shake effect
    setTimeout(() => body.classList.remove('shake'), 500); // Remove the shake effect after it plays

    fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Log the response to see what you get
            const drink = data.drinks[0];
            displayDrink(drink);
        })
        .catch(error => {
            console.error('Error fetching random drink:', error);
            document.getElementById('drink-result').innerHTML = `Error fetching random drink.`;
        });
}


function displayDrink(drink) {
    if (!drink) {
        document.getElementById('drink-result').innerHTML = 'No drink details found.';
        return;
    }

    // Display detailed drink information including name, ingredients, and instructions
    let ingredients = '';
    for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];
        if (ingredient) {
            ingredients += `<li>${measure ? measure : ''} ${ingredient}</li>`;
        }
    }

    const drinkHTML = `
        <h3>${drink.strDrink}</h3>
        <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" width="200" height="200">
        <p><strong>Category:</strong> ${drink.strCategory}</p>
        <p><strong>Glass Type:</strong> ${drink.strGlass}</p>
        <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
        <ul><strong>Ingredients:</strong>${ingredients}</ul>
    `;

    // Insert the content into the section
    document.getElementById('drink-content').innerHTML = drinkHTML;

    // Scroll to the drink section
    document.getElementById('drink-section').scrollIntoView({ behavior: 'smooth' });

    const drinkResult = document.getElementById('drink-result');
    drinkResult.classList.add('show');
    setTimeout(() => drinkResult.classList.remove('show'), 500);
}