# Pinky Studio React Storefront

Pinky Studio is a beginner friendly React project based on the supplied website requirements. It includes a responsive storefront, product search and filters, product details, account gated cart, demo checkout, and local order history.

The project uses mock data and `localStorage`. No real payment or customer information is sent anywhere.

## Run the project

```bash
npm install
npm run dev
```

Then open the local address shown by Vite.

## Project structure

```text
src/
├── components/   Reusable pieces with co-located JSX and CSS files
├── context/      Shared account, cart, and order state
├── data/         Mock catalogue data
├── pages/        Route level screens
├── services/     Browser storage helpers
├── styles/       Shared design tokens, reset, and reusable utilities
├── App.jsx       Route definitions
└── main.jsx      React entry point and providers
```

## React ideas used here

The code follows patterns from the official React documentation:

- [Your First Component](https://react.dev/learn/your-first-component): each visual part is a JavaScript function that returns JSX.
- [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component): `ProductCard` receives a product as a prop.
- [Rendering Lists](https://react.dev/learn/rendering-lists): `ProductGrid` uses `map()` and stable product IDs as keys.
- [Conditional Rendering](https://react.dev/learn/conditional-rendering): cart, login, sale price, and empty states render only when needed.
- [State: A Component's Memory](https://react.dev/learn/state-a-components-memory): filters, forms, gallery selection, and quantity controls use `useState`.
- [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components): shared cart data has one owner in `StoreProvider`.
- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context): `useStore()` makes shared store actions available without long prop chains.
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects): effects synchronize selected state with browser storage.

## Good files to study first

1. `src/components/ProductCard.jsx` for components, props, events, and conditional JSX.
2. `src/pages/ShopPage.jsx` for controlled filters and derived data.
3. `src/context/StoreContext.jsx` for shared state and immutable array updates.
4. `src/App.jsx` for the relationship between routes and pages.
5. The CSS file next to each component or page for its responsive visual styles.

## Backend upgrade path

Keep the components and replace the mock data and storage calls with HTTP requests later. A simple next backend could use Express and PostgreSQL, with authentication handled by secure server sessions. Real payments must be confirmed through signed provider callbacks on the server; the current checkout is a learning demo only.
