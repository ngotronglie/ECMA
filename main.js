// bước 1: gõ lệnh cmd  < npm i json-server  > để khởi tạo json-server 'nó sẽ tải cái foler nodemoduns và file pakage.json và pakage-log.json'
// bước 2: lấy đường dẫn để show ra các giá trị cóa trong file 'db.json'
// http://localhost:3000/products  sẽ lấy được đường dẫn này
/**
 * nhúng bootstrap vào index.html
 *  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
 */

let idEditing;

// =================================== link axios =================================
const instance = axios.create({
  baseURL: "http://localhost:3000/products",
  headers: {
    "Content-Type": "application/json",
  },
});
// gọi DOM

const productList = document.querySelector("#productList"); // lấy phần tử tbody có id = productList
const productForm = document.querySelector("#productForm");
const detail = document.querySelector("#detail");

//  =================================  hiển thị danh sách  =========================================

const getProduct = async () => {
  // hàm lấy ra sản phẩm
  try {
    const { data } = await instance.get("/");
    if (data) {
      await data.forEach((item) => {
        const itemElement = document.createElement("tr"); // tạo thêm thẻ tr ở html sau đó tạo 1 template và đổ dữ liệu từ db.json ra đó
        itemElement.innerHTML = `   
                    <td>${item.id}</td>
                    <td>
                        <button class="btn btn-info" onclick="showDetail(${item.id})">
                        ${item.name}
                        </button>
                    </td>
                    <td>${item.price}</td>
                    <td>${item.desc}</td>
                    <td>
                        <button class="btn btn-warning" onclick="updateProduct(${item.id})">update</button>
                        <button class="btn btn-danger" onclick="deleteProduct(${item.id})">delete</button>
                    </td>
                `;
        productList.appendChild(itemElement);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// ================================ thêm sản phẩm =====================
const saveProduct = async (e) => {
  e.preventDefault();
  try {
    // console.log("luu");
    const name = document.getElementById("name").value; // su dung dom lay input name
    const price = Number.parseInt(document.getElementById("price").value); // su dung dom lay input price
    const desc = document.getElementById("desc").value; // su dung dom lay input desc
    if (!name || !price || !desc) {
      alert("khongduoc bor trong");
      return;
    }
    if (price <= 0) {
      alert("gia phai > 0");
      return;
    }
    // sau do vut vao 1 object
    const newProduct = {
      name,
      price,
      desc,
    };
    if (idEditing) {
      const { data } = await instance.patch(`${idEditing}`, newProduct);
      if (data) {
        alert("sua thanh cong!");
        resetForm();
      }
    } else {
      // goi den api
      const { data } = await instance.post("/", newProduct);
      // hien thi alert
      if (data) {
        alert("Them thanh cong!");
        resetForm();
      }
    }
  } catch (error) {
    console.log(error);
  }
};
//  ============================ update san pham ===========================================
const updateProduct = async (id) => {
  try {
    idEditing = id;
    //   console.log(id);
    const { data } = await instance.get(`/${id}`);
    if (data) {
      document.getElementById("name").value = data.name;
      document.getElementById("price").value = data.price;
      document.getElementById("desc").value = data.desc;
    }
  } catch (error) {
    console.log(error);
  }
};
//  ============================ delete san pham ===========================================
const deleteProduct = async (id) => {
  try {
    // console.log(id);
    const isconfirm = confirm("Are you sure you want to delete ?");
    if (isconfirm) {
      await instance.delete(`/${id}`);
      alert("xoas thanh cong");
    }
  } catch (error) {
    console.log(error);
  }
};
//  ============================ show san pham =================================
const showDetail = async (id) => {
  try {
    const { data } = await instance.get(`/${id}`);
    if (data) {
      detail.innerHTML = `
                <h2>name: ${data.name}</h2>
                <h2>price: ${data.price}</h2>
                <h2>desc: ${data.desc}</h2>
                `;
    }
  } catch (error) {
    console.log(error);
  }
};
// ================================ reset form =========================================
const resetForm = () => {
  idEditing = undefined;
  productForm.reset();
};

// ================================ phần gọi hàm ============================================
getProduct(); // gọi hàm lấy sản phẩm
productForm.addEventListener("submit", saveProduct); // submit form
