import { useParams } from "react-router-dom";
// import { productos } from "../../mockdata/Productos";
import "./TurnDetailPage.css";

const TurnDetailPage = () => {
  // const { id } = useParams();
  // const producto = productos.find((p) => p.id === parseInt(id));

  // if (!producto) {
  //   return (
  //     <div className="product-detail-container">
  //       <div className="product-header">
  //         <h1>Producto no encontrado</h1>
  //         <p>Lo sentimos, no pudimos encontrar el producto que buscás.</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    // <div className="product-detail-container">
    //   <div className="product-header">
    //     <h1 className="product-nombre">{producto.nombre}</h1>
    //     <div className="product-categoria">{producto.categoria}</div>
    //   </div>

    //   <div className="product-content">
    //     <div className="product-image-section">
    //       <img
    //         src={producto.imagen}
    //         alt={producto.nombre}
    //         className="product-imagen"
    //       />
    //     </div>

    //     <div className="product-info-section">
    //       <div className="product-description">
    //         {producto.descripcion}
    //       </div>

    //       <div className="product-price-section">
    //         <div className="product-precio">$ {producto.precio?.toLocaleString("es-AR")}</div>
    //         <div className="price-details">Precio por unidad, impuestos incluidos</div>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="points-section">
    //     Con esta compra sumás puntos Megasuper
    //   </div>

    //   <div className="agregar-container">
    //     <button className="agregar">Agregar al carrito</button>
    //   </div>
    // </div>
    null
  );
};

export default TurnDetailPage;
