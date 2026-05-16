export default function CustomerBlock({
  customer = {
    clientName: "",
    clientPhone: "",
    address: "",
  },
  updateCustomer,
  saveCurrentOrder,
  openHistory,
  generatePdf,
}) {
  return (
    <section className="card customer-card">
      <h2>Клиент и объект</h2>

      <div className="customer-grid">
        <label>
          Клиент
          <input
            type="text"
            value={customer?.clientName || ""}
            onChange={(event) => updateCustomer("clientName", event.target.value)}
            placeholder="Имя клиента"
          />
        </label>

        <label>
          Телефон
          <input
            type="text"
            value={customer?.clientPhone || ""}
            onChange={(event) => updateCustomer("clientPhone", event.target.value)}
            placeholder="+7..."
          />
        </label>

        <label className="wide">
          Адрес объекта
          <input
            type="text"
            value={customer?.address || ""}
            onChange={(event) => updateCustomer("address", event.target.value)}
            placeholder="МО, Истра, КП..."
          />
        </label>
      </div>

      <div className="customer-actions">
        <button className="add-main" onClick={saveCurrentOrder}>
          Сохранить заказ
        </button>

        <button className="copy-btn" onClick={generatePdf}>
          PDF КП
        </button>

        <button className="copy-btn" onClick={openHistory}>
          История заказов
        </button>
      </div>
    </section>
  );
}
