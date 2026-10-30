export const getAddonPriceForDuration = (addon, duration = 2) => {
  if (!addon) return 0;
  const dur = Number(duration) || 2;
  if (dur === 1 && addon.price1Hour !== undefined) return Number(addon.price1Hour);
  if (dur === 2 && addon.price2Hours !== undefined) return Number(addon.price2Hours);
  if (dur === 3 && addon.price3Hours !== undefined) return Number(addon.price3Hours);

  if (addon.pricing) {
    if (dur === 1 && addon.pricing.oneHour !== undefined) return Number(addon.pricing.oneHour);
    if (dur === 2 && addon.pricing.twoHours !== undefined) return Number(addon.pricing.twoHours);
    if (dur === 3 && addon.pricing.threeHours !== undefined) return Number(addon.pricing.threeHours);
  }

  return Number(addon.price) || 0;
};

export const calculateBookingTotal = (theater, eventType, selectedCake, cakesList, selectedAddons, addonsList, duration = 2) => {
  const theaterPrice = theater?.price || 0;
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

    let price = getAddonPriceForDuration(addon, duration);
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

  const subtotal = theaterPrice + addOnsTotal + cakePrice;
  const advanceAmount = 750;
  const balanceAmount = subtotal > advanceAmount ? subtotal - advanceAmount : 0;

  return {
    theaterPrice,
    addOnsTotal,
    cakePrice,
    subtotal,
    advanceAmount,
    balanceAmount,
    processedCake,
    processedAddons
  };
};
