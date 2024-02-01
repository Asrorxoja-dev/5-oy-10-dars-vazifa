
const button = document.getElementById('button');
const name = document.getElementById('name');
const price = document.getElementById('prise');
const description = document.getElementById('description');
const wrapper = document.getElementById('wrapper');
const form = document.getElementById('form');

function createCard(phone, index) {
    return `
        <tr>
            <th scope="row">${index}</th>
            <td>${phone.name}</td>
            <td>${phone.price}</td>
            <td>${phone.description}</td>
            <td data-id= 'data_${phone.id}'>
                <span class="text-danger" style="cursor: pointer;">delete</span>
                <span class="text-primary" style="cursor: pointer;">update</span>
            </td>
        </tr>
    `;
}



document.addEventListener('DOMContentLoaded', function () {
    fetch('https://auth-rg69.onrender.com/api/products/all', {
        method: "GET"
    })
    .then((res) => res.json())
    .then(data => {
        if (data.length) {
            data.forEach((phone, index) => {
                let card = createCard(phone, index + 1);
                wrapper.innerHTML += card;
            });

            const deleteButtons= document.querySelectorAll('span.text-danger');
            if(deleteButtons.length){
                deleteButtons.forEach(del=>{
                    del && del.addEventListener('click', function(){
                        let id = this.parentNode.getAttribute('data-id').substring(5)
                        if(id){
                            let isDelete = confirm("Rostdan ham ushbu malumotni ochirmoqchimiz")
                            if(isDelete){
                                fetch(`https://auth-rg69.onrender.com/api/products/${id}`,{
                                    method:"DELETE"
                                })
                                .then(res=> res.json())
                                .then(data => {
                                   if(data.message == "Mahsulot muvaffaqiyatli o'chirildi"){
                                    window.location.reload();
                                   }
                                })
                                .catch(err=>{
                                    console.log(err);
            
                                })
                            }
                        }
                    })
                })
            }
        }
    })
    .catch(err => {
        console.log(err);
    });
});


function validate(name, price){
  if(!name.value){
    alert('nomi kiritilishi shart')
    name.focus();
    return false;
  }

  if(name.value.trim().length < 3){
    alert('nomi kamida 3 ta belgidan iborat bolishi kerak')
    name.focus();
    return false;
  }

  if(!price.value){
    alert('narxi kiritilishi shart')
    price.focus();
    return false;
  }

  if(!Number(price.value)){
    alert('narxi raqamlarda kiritilishi shart')
    price.focus();
    return false;
  }


  if(price.value <= 0){
    alert('narxi manfiy bolmasligi kerak')
    price.focus();
    return false;
  }

    return true;
};


button && button.addEventListener('click', function(e){
    e.preventDefault();
    if(validate(name, price)){
        let phone = {
            name:name.value,
            price:price.value,
            description:description.value,
            status:"active",
            category_id:"2",
        }

        fetch("https://auth-rg69.onrender.com/api/products", {
            method:"POST" ,
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify(phone)

        })

        .then(res => res.json())
        .then(data => {
            if(data.id){
                let row = createCard(phone, wrapper.children.length + 1);
                wrapper.innerHTML += row;
                form.reset();
            }            
        })

        .catch(err => {
            console.log(err);
        })
        
    }
});


