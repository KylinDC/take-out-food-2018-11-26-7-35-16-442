function bestCharge(orders) {

  let orderDetailArray = [];

  let totalPrice = 0;

  for (let order of orders) {
    orderDetailArray.push(getOrderDetail(order));
  }

  for (let orderDetail of orderDetailArray) {
    totalPrice += orderDetail.orderPrice;
  }

  let priceBreakDiscount = getPriceBreakDiscount(totalPrice, 30, 6);

  let itemPercentDiscounts = { discountItems: [], discount: 0 };
  for (let order of orders) {
    itemPercentDiscount = getItemPercentDiscount(order, 0.5);
    if (itemPercentDiscount) {
      itemPercentDiscounts.discountItems.push(itemPercentDiscount.discountItem);
      itemPercentDiscounts.discount += itemPercentDiscount.discount;
    }
  }

  let selectedPromotion = getSelectedPromotion(priceBreakDiscount, itemPercentDiscounts);

  totalPrice -= selectedPromotion.discount;

  let bestChargeInfo = {}
  bestChargeInfo.orderDetail = orderDetailArray;
  bestChargeInfo.selectedPromotion = selectedPromotion;
  bestChargeInfo.totalPrice = totalPrice;












  let orderDetailMessage = "";

  for (let i of bestChargeInfo.orderDetail) {
    orderDetailMessage += `${i.name} x ${i.amount} = ${i.orderPrice}元
`
  }

  orderDetailMessage = orderDetailMessage.trim();

  let message;

  if (bestChargeInfo.selectedPromotion.discount > 0) {

    message = `============= 订餐明细 =============
${orderDetailMessage}
-----------------------------------
使用优惠:
${bestChargeInfo.selectedPromotion.promotion}，省${bestChargeInfo.selectedPromotion.discount}元
-----------------------------------
总计：${bestChargeInfo.totalPrice}元
===================================`}


  else {
    message = `============= 订餐明细 =============
${orderDetailMessage}
-----------------------------------
总计：${bestChargeInfo.totalPrice}元
===================================`
  }





  return message;
}

function getOrderDetail(order) {
  let orderDetail = {};
  let item = getItemByID(order.split(' x ')[0]);
  orderDetail.name = item.name;
  orderDetail.amount = parseInt(order.split(' x ')[1]);
  orderDetail.orderPrice = getOrderPrice(item, orderDetail.amount);
  return orderDetail;
}

function getOrderPrice(item, amount) {
  return item.price * amount;
}

function getPriceBreakDiscount(totalPrice, price, discount) {
  return Math.floor((totalPrice / price)) * discount;
}

function getItemPercentDiscount(order, discountPercent) {
  let promotionItems = loadPromotions()[1]['items'];
  let itemId = order.split(' x ')[0];

  if (promotionItems.includes(itemId)) {
    let itemPercentDiscount = {};
    let price = getItemByID(itemId).price;
    itemPercentDiscount.discountItem = getItemByID(itemId).name;
    itemPercentDiscount.discount = price * discountPercent;
    return itemPercentDiscount;
  }

}

function getSelectedPromotion(priceBreakDiscount, itemPercentDiscounts) {
  let selectedPromotion = {};
  if (priceBreakDiscount >= itemPercentDiscounts.discount) {
    selectedPromotion.promotion = loadPromotions()[0].type;
    selectedPromotion.discount = priceBreakDiscount;
  } else {
    selectedPromotion.promotion = `${loadPromotions()[1].type}(${itemPercentDiscounts.discountItems.join('，')})`;
    selectedPromotion.discount = itemPercentDiscounts.discount;
  }
  return selectedPromotion;
}

function getItemByID(id) {
  let items = loadAllItems();
  for (let i of items) {
    if (i.id === id) {
      return i;
    }
  }
}
