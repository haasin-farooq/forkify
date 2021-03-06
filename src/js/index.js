// https://forkify-api.herokuapp.com/api/search

import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of the app
* - Search object
* - Current recipe object
* - Liked recipes
*/
const state = {};

/**
 * Search Controller
 */
const controlSearch = async () => {
    // 1. Get the query from the view
    const query = searchView.getInput();
    console.log(query);

    if(query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI fro results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResult);

        try {
            // 4. Search for recipes
            await state.search.getResults();

            // 5. Render results on the UI
            clearLoader();
            searchView.renderResults(state.search.result);
        }
        catch(error) {
            console.log(error);
            alert(error);
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
});

/**
 * Recipe Controller
 */
const controlRecipe = async () => {
    // Get ID from the URL
    const id = window.location.hash.replace('#', '');
    
    if(id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Create new recipe object
        state.recipe = new Recipe(id);

        // TESTING
        window.r = state.recipe;

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calculateTime();
            state.recipe.calculateServings();

            // Render the recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        }
        catch(error) {
            console.log(error);
            alert(error);
        }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));