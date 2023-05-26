

/*
kod je potřeba pojmenovat podle toho, jak máme jednotlivé komponenty a fce pojmenované my

V tomto návrhu komponenty RecipeTile se používá React s funkcionalitou hooks. Komponenta přijímá objekt receptu (item) jako prop a využívá context IdentityContext pro získání informací o přihlášeném uživateli.

V rámci komponenty je definována funkce handleStarClick, která je vyvolána po kliknutí na tlačítko hvězdičky. Tato funkce volá funkci setStar z backendového API s odpovídajícími daty (ID receptu, ID uživatele a hodnota starred). Funkce setStar slouží pro komunikaci s backendem a aktualizaci stavu oblíbenosti receptu.

Po úspěšném volání funkce setStar se v konzoli vypíše zpráva s ID receptu. Zde můžete provést další akce nebo překreslit komponentu, abyste zobrazili změnu stavu oblíbenosti. Pokud nastane chyba při volání funkce, vypíše se chybová zpráva do konzole.

V rámci vizuálního zobrazení je použit React Bootstrap komponenta Button, která je vykreslena s variantou warning pro žlutou barvu (pokud je recept oblíbený) nebo light pro šedou
*/

import React, { useContext } from 'react';

// tady bude cesta na js soubor, ktery bude button (hvezda)
import { Button } from 'react-bootstrap';
// tady bude cesta na recept
import { IdentityContext } from 'path/to/identity/context';
// tady bude nalinkovany backend
import { setStar } from 'path/to/backend/api'; // Import funkce pro volání backendového endpointu

// funkce, ktera resi zabarveni / nezabarveni hvezdy a soucasne oznaceni receptu a uzivatele v datech
function RecipeTile({ item }) {
  const { identity } = useContext(IdentityContext);
  const isFavorite = item.favoriteUsers.includes(identity.id); // Kontrola, zda je recept v oblíbených uživatele

  const handleStarClick = async () => {
    try {
      await setStar({
        recipeId: item.id,
        userId: identity.id,
        starred: !isFavorite // Invertování hodnoty, protože kliknutím se mění stav oblíbenosti
      });
      console.log(`Clicked on star for recipe with ID: ${item.id}`);
      // Zde můžete provést další akce nebo překreslit komponentu pro zobrazení změny stavu oblíbenosti
    } catch (error) {
      console.error('An error occurred while setting star:', error);
      // Zde můžete zobrazit vhodnou chybovou zprávu uživateli
    }
  };

  // vizualizace tlacitka primo na webu
  return (
    <div>
      {/* Zde můžete zobrazit informace o receptu */}
      <Button variant={isFavorite ? 'warning' : 'light'} onClick={handleStarClick}>
        {/* Zde můžete umístit ikonu hvězdičky nebo jiný symbol */}
        Star
      </Button>
    </div>
  );
}

// vypis, kam se ma info poslat
export default RecipeTile;
