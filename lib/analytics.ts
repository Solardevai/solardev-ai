window.gtag("event", "begin_checkout", {
  currency,
  value: price,
  button_location: buttonLocation,
  items: [
    {
      item_id: itemId,
      item_name: itemName,
      item_category: itemCategory,
      price,
      quantity: 1,
    },
  ],
});