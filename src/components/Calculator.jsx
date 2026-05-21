import { useEffect, useMemo, useState } from "react";

import BlockSelector from "./BlockSelector";
import QuantityInputs from "./QuantityInputs";
import PriceBlock from "./PriceBlock";
import GlueBlock from "./GlueBlock";
import DeliveryBlock from "./DeliveryBlock";
import Cart from "./Cart";
import LintelModal from "./LintelModal";
import CeramicSelector from "./CeramicSelector";
import OtherSelector from "./OtherSelector";
import Toast from "./Toast";
import CustomerBlock from "./CustomerBlock";
import OrderHistory from "./OrderHistory";
import SegmentedButtons from "./SegmentedButtons";

import { ALL_BLOCKS } from "../data/manufacturers";
import { findClosestBlock, normalizeProduct } from "../utils/blockOptions";
import { calculateByM3, calculateByPieces, calculateByPallets } from "../utils/calculateBlock";
import { calculateFinalPrice, calculateProductTotal } from "../utils/calculatePrice";
import { calculateGlueBags, calculateFoamBalloons } from "../utils/calculateGlue";
import { calculateDeliveryTotal, getDeliveryItems } from "../utils/calculateDelivery";
import {
  getOrderHistory,
  saveOrderToHistory,
  deleteOrderFromHistory,
  clearOrderHistory,
} from "../utils/orderHistory";
import { getBlockPrice } from "../data/blockPrices";

const STORAGE_KEY = "bonolit-minimal-calculator-state";

const DEFAULT_CUSTOMER = {
  clientName: "",
  clientPhone: "",
  address: "",
};

const defaultState = {
  productType: "block",
  product: {
    ...ALL_BLOCKS[0],
    density: "D500",
    strength: "B3.5",
    m3: 0,
    pieces: 0,
    pallets: 0,
    percent: -7,
    pricePerM3: 5568,
  },
  glue: {
    bagsQty: 0,
    bagPrice: 350,
    foamQty: 0,
    foamPrice: 650,
  },
  delivery: {
    truckQty: 0,
    truckPrice: 0,
    manipulatorQty: 0,
    manipulatorPrice: 0,
    trailerQty: 0,
    trailerPrice: 0,
    unloadQty: 0,
    unloadPrice: 0,
  },
  cart: [],
  editingItemId: null,
  editingOtherItemId: null,
  isLintelModalOpen: false,
  toast: null,
  theme: localStorage.getItem("app-theme") || "classic",
  isHistoryOpen: false,
  orderHistory: [],
  customer: DEFAULT_CUSTOMER,
};

export default function Calculator() {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return defaultState;

    try {
      const parsed = JSON.parse(saved);

      return {
        ...defaultState,
        ...parsed,
        customer: {
          ...DEFAULT_CUSTOMER,
          ...(parsed.customer || {}),
        },
        orderHistory: parsed.orderHistory || [],
        isHistoryOpen: false,
        toast: null,
  theme: localStorage.getItem("app-theme") || "classic",
      };
    } catch {
      return defaultState;
    }
  });

  const {
    
    productType,
    product,
    glue,
    delivery,
    cart,
    editingItemId,
    editingOtherItemId,
    isLintelModalOpen,
    toast,
    isHistoryOpen,
    orderHistory,
  } = state;

  const editingOtherItem = cart.find((item) => item.id === editingOtherItemId && item.type === "other") || null;

  const customer = {
    ...DEFAULT_CUSTOMER,
    ...(state.customer || {}),
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      orderHistory: getOrderHistory(),
    }));
  }, []);

  const finalPrice = useMemo(() => calculateFinalPrice(product.pricePerM3, product.percent), [product.pricePerM3, product.percent]);
  const productTotal = useMemo(() => calculateProductTotal(product.m3, finalPrice), [product.m3, finalPrice]);
  const deliveryTotal = useMemo(() => calculateDeliveryTotal(delivery), [delivery]);
  const deliveryItems = useMemo(() => getDeliveryItems(delivery), [delivery]);
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.total, 0) + deliveryTotal, [cart, deliveryTotal]);

  function showToast(text, type = "success") {
    setState((prev) => ({
      ...prev,
      toast: { text, type, id: Date.now() },
    }));

    window.setTimeout(() => {
      setState((prev) => ({
        ...prev,
        toast: null,
  theme: localStorage.getItem("app-theme") || "classic",
      }));
    }, 2400);
  }

  function setProductType(value) {
    setState((prev) => ({
      ...prev,
      productType: value,
    }));
  }
  function clearCustomer() {
    setState((prev) => ({
      ...prev,
      customer: {
        clientName: "",
        clientPhone: "",
        address: "",
      },
    }));

    showToast("Поля клиента очищены");
  }

  function updateCustomer(field, value) {
    setState((prev) => ({
      ...prev,
      customer: {
        ...DEFAULT_CUSTOMER,
        ...(prev.customer || {}),
        [field]: value,
      },
    }));
  }

  function getGoodsTotal() {
    return cart.reduce((sum, item) => sum + Number(item.total || 0), 0);
  }

  function createOrderSnapshot() {
    const date = new Date();
    const number = String(date.getTime()).slice(-6);

    const deliveryItemsSnapshot = getDeliveryItems(delivery);
    const deliveryTotalSnapshot = calculateDeliveryTotal(delivery);
    const goodsTotalSnapshot = cart.reduce((sum, item) => sum + Number(item.total || 0), 0);

    return {
      id: String(date.getTime()),
      number,
      date: date.toLocaleDateString("ru-RU"),
      customer,
      clientName: customer.clientName || "",
      clientPhone: customer.clientPhone || "",
      address: customer.address || "",
      cart: [...cart],
      delivery: { ...delivery },
      deliveryItems: deliveryItemsSnapshot,
      goodsTotal: goodsTotalSnapshot,
      deliveryTotal: deliveryTotalSnapshot,
      total: goodsTotalSnapshot + deliveryTotalSnapshot,
      productType,
      status: "Сохранен",
    };
  }

  function saveCurrentOrder() {
    if (!cart.length && !deliveryItems.length) {
      showToast("Добавьте позиции в заказ", "error");
      return;
    }

    const order = createOrderSnapshot();
    const history = saveOrderToHistory(order);

    setState((prev) => ({
      ...prev,
      orderHistory: history,
    }));

    showToast(`Заказ №${order.number} сохранен`);
  }

  function loadOrder(order) {
    setState((prev) => ({
      ...prev,
      cart: order.cart || [],
      delivery: {
        ...prev.delivery,
        ...(order.delivery || {}),
      },
      customer: {
        clientName: order.customer?.clientName || order.clientName || "",
        clientPhone: order.customer?.clientPhone || order.clientPhone || "",
        address: order.customer?.address || order.address || "",
      },
      isHistoryOpen: false,
    }));

    showToast(`Заказ №${order.number} открыт`);
  }

  function repeatOrder(order) {
    setState((prev) => ({
      ...prev,
      cart: [...prev.cart, ...(order.cart || []).map((item) => ({
        ...item,
        id: Date.now() + Math.random(),
      }))],
      isHistoryOpen: false,
    }));

    showToast(`Заказ №${order.number} повторен`);
  }

  function deleteHistoryOrder(orderId) {
    const history = deleteOrderFromHistory(orderId);

    setState((prev) => ({
      ...prev,
      orderHistory: history,
    }));

    showToast("Заказ удален из истории");
  }

  function clearHistory() {
    const history = clearOrderHistory();

    setState((prev) => ({
      ...prev,
      orderHistory: history,
    }));

    showToast("История очищена");
  }

  function updateProductParam(field, value) {
    setState((prev) => {
      let draft = {
        ...prev.product,
        [field]: value,
      };

      if (field === "density" && value === "D600") {
        draft.strength = "B5";
      }

      if (field === "density" && value === "D500") {
        draft.strength = "B3.5";
      }

      if (field === "density" && value === "D400") {
        draft.strength = "B2.5";
      }

      draft = normalizeProduct(draft);

      const matchedBlock = findClosestBlock(draft);
      const recalculated = calculateByM3(draft.m3, matchedBlock);

      const autoPrice = getBlockPrice({
        manufacturerKey: matchedBlock.manufacturerKey,
        factory: matchedBlock.factory,
        density: matchedBlock.density,
        strength: matchedBlock.strength,
        width: matchedBlock.width,
      });

      const productFields = [
        "manufacturerKey",
        "factory",
        "density",
        "strength",
        "length",
        "width",
        "height",
      ];

      const nextPricePerM3 =
        field === "pricePerM3"
          ? value
          : productFields.includes(field)
            ? autoPrice
            : draft.pricePerM3;

      return {
        ...prev,
        product: {
          ...matchedBlock,
          density: matchedBlock.density,
          strength: matchedBlock.strength,
          factory: matchedBlock.factory,
          percent: draft.percent,
          pricePerM3: nextPricePerM3,
          ...recalculated,
        },
      };
    });
  }

  function updateGlue(field, value) {
    setState((prev) => ({ ...prev, glue: { ...prev.glue, [field]: value } }));
  }

  function syncQuantity(result) {
    setState((prev) => ({
      ...prev,
      product: { ...prev.product, ...result },
    }));
  }

  function updateQuantityByM3(value) {
    syncQuantity(calculateByM3(value, product));
  }

  function updateQuantityByPieces(value) {
    syncQuantity(calculateByPieces(value, product));
  }

  function updateQuantityByPallets(value) {
    syncQuantity(calculateByPallets(value, product));
  }

  function updateDelivery(field, value) {
    setState((prev) => ({ ...prev, delivery: { ...prev.delivery, [field]: value } }));
  }

  function applyAutoDelivery(patch) {
    setState((prev) => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        ...patch,
      },
    }));
  }

  function makeBlockCartItem(id) {
    return {
      id,
      type: "block",
      title: `Блок ${product.manufacturer} ${product.density} ${product.length}*${product.width}*${product.height} ${product.strength.replace(".", ",")} F100 ГОСТ 31360`,
      description: `${product.pallets} под. по ${product.piecesPerPallet} шт - ${product.pieces} шт · ${product.m3} м3 * ${finalPrice} ₽`,
      manufacturer: product.manufacturer,
      manufacturerKey: product.manufacturerKey,
      factory: product.factory,
      density: product.density,
      strength: product.strength,
      length: product.length,
      width: product.width,
      height: product.height,
      palletM3: product.palletM3,
      piecesPerPallet: product.piecesPerPallet,
      pricePerM3: product.pricePerM3,
      percent: product.percent,
      finalPrice,
      m3: product.m3,
      pieces: product.pieces,
      pallets: product.pallets,
      total: productTotal,
    };
  }

  function cancelEdit() {
    setState((prev) => ({
      ...prev,
      editingItemId: null,
  editingOtherItemId: null,
    }));

    showToast("Редактирование отменено");
  }

  function addBlockToCart() {
    if (!product.m3 || product.m3 <= 0) {
      showToast("Введите количество блоков", "error");
      return;
    }

    if (editingItemId !== null) {
      const updatedItem = makeBlockCartItem(editingItemId);

      setState((prev) => ({
        ...prev,
        cart: prev.cart.map((item) =>
          item.id === editingItemId ? updatedItem : item
        ),
        editingItemId: null,
  editingOtherItemId: null,
      }));

      showToast("Изменения сохранены");
      return;
    }

    const item = makeBlockCartItem(Date.now());

    setState((prev) => ({
      ...prev,
      cart: [...prev.cart, item],
    }));

    showToast("Добавлено в заказ");
  }

  function getBlocksM3InCart() {
    return cart
      .filter((item) => item.type === "block")
      .reduce((sum, item) => sum + Number(item.m3 || 0), 0);
  }

  function calculateGlueForOrder() {
    const totalM3 = getBlocksM3InCart();

    if (!totalM3 || totalM3 <= 0) {
      showToast("Сначала добавьте блоки в заказ", "error");
      return;
    }

    setState((prev) => ({
      ...prev,
      glue: {
        ...prev.glue,
        bagsQty: calculateGlueBags(totalM3),
        foamQty: calculateFoamBalloons(totalM3),
      },
    }));
  }

  function addGlueToCart() {
    if (!glue.bagsQty || glue.bagsQty <= 0) {
      showToast("Укажите количество клея", "error");
      return;
    }

    const item = {
      id: Date.now(),
      type: "glue",
      title: "Клей 25 кг",
      description: `${glue.bagsQty} меш. × ${glue.bagPrice} ₽`,
      total: glue.bagsQty * glue.bagPrice,
    };

    setState((prev) => ({ ...prev, cart: [...prev.cart, item] }));
    showToast("Клей добавлен");
  }

  function addFoamToCart() {
    if (!glue.foamQty || glue.foamQty <= 0) {
      showToast("Укажите количество клей-пены", "error");
      return;
    }

    const item = {
      id: Date.now() + 1,
      type: "foam",
      title: "Клей-пена",
      description: `${glue.foamQty} бал. × ${glue.foamPrice} ₽`,
      total: glue.foamQty * glue.foamPrice,
    };

    setState((prev) => ({ ...prev, cart: [...prev.cart, item] }));
    showToast("Клей-пена добавлена");
  }

  function startEditCartItem(id) {
    const item = cart.find((cartItem) => cartItem.id === id);

    if (!item) return;

    if (item.type === "other") {
      setState((prev) => ({
        ...prev,
        productType: "other",
        editingOtherItemId: id,
      }));
      return;
    }

    if (item.type !== "block") return;

    setState((prev) => ({
      ...prev,
      editingItemId: id,
      product: {
        ...prev.product,
        manufacturer: item.manufacturer,
        manufacturerKey: item.manufacturerKey,
        factory: item.factory,
        density: item.density,
        strength: item.strength,
        length: item.length,
        width: item.width,
        height: item.height,
        palletM3: item.palletM3,
        piecesPerPallet: item.piecesPerPallet,
        pricePerM3: item.pricePerM3,
        percent: item.percent,
        m3: item.m3,
        pieces: item.pieces,
        pallets: item.pallets,
      },
    }));
  }

  function addOtherToCart(item) {
    setState((prev) => ({
      ...prev,
      cart: [...prev.cart, item],
    }));
  }

  function updateOtherInCart(item) {
    setState((prev) => ({
      ...prev,
      cart: prev.cart.map((cartItem) =>
        cartItem.id === item.id ? item : cartItem
      ),
      editingOtherItemId: null,
    }));
  }

  function clearEditingOther() {
    setState((prev) => ({
      ...prev,
      editingOtherItemId: null,
    }));
  }

  function addCeramicToCart(item) {
    setState((prev) => ({
      ...prev,
      cart: [...prev.cart, item],
    }));

    showToast("Керамика добавлена");
  }

  function addUBlockToCart(item) {
    setState((prev) => ({
      ...prev,
      cart: [...prev.cart, item],
    }));

    showToast("U-блок добавлен");
  }

  function addLintelToCart(item) {
    setState((prev) => ({
      ...prev,
      cart: [...prev.cart, item],
    }));

    showToast("Перемычка добавлена");
  }

  function removeFromCart(id) {
    setState((prev) => ({ ...prev, cart: prev.cart.filter((item) => item.id !== id) }));
  }

  function clearCart() {
    setState((prev) => ({
      ...prev,
      cart: [],
      delivery: {
        ...prev.delivery,
        truckQty: 0,
        manipulatorQty: 0,
        trailerQty: 0,
        unloadQty: 0,
      },
    }));
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("ru-RU").format(Number(value || 0));
  }

  function formatQtyValue(value) {
    if (value === "" || value === null || value === undefined) return "0";

    const prepared = String(value).replace(",", ".");
    const number = Number(prepared);

    if (Number.isNaN(number)) {
      return String(value);
    }

    return new Intl.NumberFormat("ru-RU", {
      maximumFractionDigits: 3,
    }).format(number);
  }

  function formatM3(value) {
    return formatQtyValue(value);
  }

  function moneyLine(qty, unit, price, total) {
    return `${formatQtyValue(qty)} ${unit} × ${formatNumber(price)} ₽ = ${formatNumber(total)} ₽`;
  }

  function getItemPrice(item) {
    return item.finalPrice || item.price || item.pricePerM3 || 0;
  }

  function getItemQtyUnit(item) {
    if (item.type === "block") {
      return {
        qty: item.m3,
        unit: "м3",
      };
    }

    if (item.type === "ceramic") {
      return {
        qty: item.qty,
        unit: "шт",
      };
    }

    if (item.type === "ublock" || item.type === "lintel") {
      return {
        qty: item.qty,
        unit: "шт",
      };
    }

    if (item.type === "other") {
      return {
        qty: item.qty,
        unit: item.unit,
      };
    }

    if (item.type === "glue" || item.type === "foam") {
      return {
        qty: item.qty,
        unit: item.unit || "шт",
      };
    }

    return {
      qty: item.qty || 1,
      unit: item.unit || "шт",
    };
  }

  function getFullItemText(item) {
    const { qty, unit } = getItemQtyUnit(item);
    const price = getItemPrice(item);

    if (item.type === "block") {
      return [
        item.title,
        `${item.pallets} под. по ${item.piecesPerPallet} шт - ${item.pieces} шт`,
        moneyLine(qty, unit, price, item.total),
      ].join("\n");
    }

    if (item.type === "ceramic") {
      return [
        item.title,
        `${item.pallets} под. по ${item.pcsPerPallet} шт - ${item.qty} шт`,
        `${formatM3(item.m3)} м3`,
        moneyLine(qty, unit, price, item.total),
      ].join("\n");
    }

    return [
      item.title || item.shortTitle,
      moneyLine(qty, unit, price, item.total),
    ].join("\n");
  }

  function getMinimalItemText(item) {
    const { qty, unit } = getItemQtyUnit(item);
    const price = getItemPrice(item);

    if (item.type === "block") {
      return `${item.density} ${item.length}*${item.width}*${item.height} ${item.strength.replace(".", ",")} - ${moneyLine(qty, unit, price, item.total)}`;
    }

    if (item.type === "ceramic") {
      return `${item.shortTitle} - ${moneyLine(qty, unit, price, item.total)}`;
    }

    return `${item.shortTitle || item.title} - ${moneyLine(qty, unit, price, item.total)}`;
  }

  function makeFullOrderText() {
    return [
      ...cart.map(getFullItemText),
      ...deliveryItems.map((item) => `${item.title}
${moneyLine(item.qty, "шт", item.price, item.total)}`),
      `Итого: ${formatNumber(total)} ₽`,
    ].join("\n");
  }

  function makeMinimalOrderText() {
    return [
      ...cart.map(getMinimalItemText),
      ...deliveryItems.map((item) => `${item.title} - ${moneyLine(item.qty, "шт", item.price, item.total)}`),
      `Итого: ${formatNumber(total)} ₽`,
    ].join("\n");
  }

  function copyCart(mode = "full") {
    const text = mode === "minimal" ? makeMinimalOrderText() : makeFullOrderText();

    navigator.clipboard?.writeText(text);
    showToast(mode === "minimal" ? "Минимальный заказ скопирован" : "Полный заказ скопирован");
  }

  return (
    <main className="app theme-classic">
      <div className="calculator-column">
<CustomerBlock
          customer={customer}
          updateCustomer={updateCustomer}
          saveCurrentOrder={saveCurrentOrder}
          openHistory={() =>
            setState((prev) => ({ ...prev, isHistoryOpen: true }))
          }
          clearCustomer={clearCustomer}
        />
<SegmentedButtons
          options={["Блок", "Керамика", "Другой"]}
          value={productType === "block" ? "Блок" : productType === "ceramic" ? "Керамика" : "Другой"}
          onChange={(value) => {
            if (value === "Блок") setProductType("block");
            if (value === "Керамика") setProductType("ceramic");
            if (value === "Другой") setProductType("other");
          }}
        />

        

                {productType === "block" && (
          <>
            <BlockSelector
              product={product}
              updateProductParam={updateProductParam}
              showToast={showToast}
              openLintelModal={() =>
                setState((prev) => ({ ...prev, isLintelModalOpen: true }))
              }
            />

            <QuantityInputs
              product={product}
              updateQuantityByM3={updateQuantityByM3}
              updateQuantityByPieces={updateQuantityByPieces}
              updateQuantityByPallets={updateQuantityByPallets}
            />

            <PriceBlock
              product={product}
              updateProductParam={updateProductParam}
              finalPrice={finalPrice}
              productTotal={productTotal}
              addBlockToCart={addBlockToCart}
              isEditing={editingItemId !== null}
              cancelEdit={cancelEdit}
            />

            <GlueBlock
              glue={glue}
              updateGlue={updateGlue}
              calculateGlueForOrder={calculateGlueForOrder}
              addGlueToCart={addGlueToCart}
              addFoamToCart={addFoamToCart}
            />
          </>
        )}

        {productType === "ceramic" && (
          <CeramicSelector
            onAddCeramic={addCeramicToCart}
            showToast={showToast}
          />
        )}

        {productType === "other" && (
          <OtherSelector
            onAddOther={addOtherToCart}
            onUpdateOther={updateOtherInCart}
            editingOtherItem={editingOtherItem}
            clearEditingOther={clearEditingOther}
            showToast={showToast}
          />
        )}

        <DeliveryBlock
          delivery={delivery}
          updateDelivery={updateDelivery}
          cart={cart}
          applyAutoDelivery={applyAutoDelivery}
          showToast={showToast}
        />
      </div>

      <Cart
        cart={cart}
        total={total}
        deliveryItems={deliveryItems}
        deliveryTotal={deliveryTotal}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        copyCart={copyCart}
        startEditCartItem={startEditCartItem}
      />

      <OrderHistory
        orders={orderHistory}
        isOpen={isHistoryOpen}
        onClose={() =>
          setState((prev) => ({ ...prev, isHistoryOpen: false }))
        }
        onLoadOrder={loadOrder}
        onRepeatOrder={repeatOrder}
        onDeleteOrder={deleteHistoryOrder}
        onClearHistory={clearHistory}
      />

      <Toast message={toast} />

      <LintelModal
        isOpen={isLintelModalOpen}
        onClose={() =>
          setState((prev) => ({ ...prev, isLintelModalOpen: false }))
        }
        onAddLintel={addLintelToCart}
        onAddUBlock={addUBlockToCart}
        showToast={showToast}
      />
    </main>
  );
}
