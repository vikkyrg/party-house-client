export const calculateBookingTotal = (theater, eventType, selectedCake, cakesList, selectedAddons, addonsList) => {
  let theaterPrice = theater?.pricePerHour || 0;
  const extraGuestPrice = theater?.additionalGuestPrice ?? theater?.extraGuestPrice ?? 0;
  const extraGuestCount = Math.max(0, Number(theater?.selectedMembers || 0) - (theater?.capacity || 0));
  const extraGuestTotal = extraGuestCount * extraGuestPrice;
  let cakePrice = 0;
  let processedCake = null;
  let addOnsTotal = 0;
  const processedAddons = [];

  // Cake Calculation
  if (selectedCake && selectedCake.cakeId && cakesList?.length) {
    const cakeDoc = cakesList.find(c => c._id === selectedCake.cakeId);
    if (cakeDoc) {
      const sizeObj = cakeDoc.sizes.find(s => s.name === selectedCake.size);
      if (sizeObj) {
        cakePrice = sizeObj.price;
        processedCake = {
          ...cakeDoc,
          sizeName: sizeObj.name,
          sizeLabel: sizeObj.label,
          price: cakePrice,
          total: cakePrice
        };
      }
    }
  }

  Object.entries(selectedAddons).forEach(([id, selection]) => {
    // selection is { quantity: number } - though we only use selection as a boolean basically, 
    // handleAddonToggle sets { quantity: 1, variantName: defaultVariant }
    const addon = addonsList.find((a) => a._id === id);
    if (!addon) return;

    let price = addon.price || 0;
    const quantity = selection.quantity || 1;
    const totalForAddon = price * quantity;
    addOnsTotal += totalForAddon;

    processedAddons.push({
      ...addon,
      quantity,
      finalPrice: price,
      total: totalForAddon
    });
  });

  const subtotal = theaterPrice + extraGuestTotal + addOnsTotal + cakePrice;
  const advanceAmount = 750;
  const balanceAmount = subtotal > advanceAmount ? subtotal - advanceAmount : 0;

  return {
    theaterPrice,
    extraGuestPrice,
    extraGuestCount,
    extraGuestTotal,
    addOnsTotal,
    cakePrice,
    subtotal,
    advanceAmount,
    balanceAmount,
    processedCake,
    processedAddons
  };
};
