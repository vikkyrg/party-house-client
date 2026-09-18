export const calculateBookingTotal = (theater, eventType, selectedAddons, addonsList) => {
  let theaterPrice = theater?.pricePerHour || 0;
  let eventTypePrice = eventType?.price || 0; // basePrice or price
  
  if (eventType && typeof eventType.basePrice === 'number') {
    eventTypePrice = eventType.basePrice;
  }

  let addOnsTotal = 0;
  const processedAddons = [];

  Object.entries(selectedAddons).forEach(([id, selection]) => {
    // selection is { quantity: number, variantName: string }
    const addon = addonsList.find((a) => a._id === id);
    if (!addon) return;

    let price = addon.price || 0;
    if (selection.variantName && addon.variants?.length > 0) {
      const variant = addon.variants.find(v => v.name === selection.variantName);
      if (variant) {
        price = variant.price;
      }
    }

    const quantity = selection.quantity || 1;
    const totalForAddon = price * quantity;
    addOnsTotal += totalForAddon;

    processedAddons.push({
      ...addon,
      selectedVariant: selection.variantName,
      quantity,
      finalPrice: price,
      total: totalForAddon
    });
  });

  const subtotal = theaterPrice + eventTypePrice + addOnsTotal;
  const advanceAmount = 750;
  const balanceAmount = subtotal > advanceAmount ? subtotal - advanceAmount : 0;

  return {
    theaterPrice,
    eventTypePrice,
    addOnsTotal,
    subtotal,
    advanceAmount,
    balanceAmount,
    processedAddons
  };
};
