async function dropdownPuestos() {
    const empresa = localStorage.getItem("empresa");
    console.log(empresa);
    try {
        const respuestaPuestos = await fetch('http://localhost:3000/empleosAdmin?empresa=' + empresa);
        const puestos = await respuestaPuestos.json();
        console.log(puestos);

        const puestosHTML = document.getElementById('puesto');

        puestos.forEach(function(puesto) {
            const select = `<option value="${puesto._id}">${puesto.titulo}</option>`;
            puestosHTML.innerHTML += select;
        });
    } catch (error) {
        console.log(error);
        alert(error);
    }
};

async function invitarUsuarioAPuesto(evento) {
    evento.preventDefault();
    const idPuesto = document.getElementById('puesto').value;
    const nombrePuesto = document.getElementById('puesto').options[document.getElementById('puesto').selectedIndex].text;
    const correoInvitado = document.getElementById('correo').value;
    const nombreAdministrador = localStorage.getItem("userName");
    const correoAdministrador = localStorage.getItem("userEmail");
    const empresa = localStorage.getItem("empresa");

    const data = {
        idPuesto,
        nombrePuesto,
        correoInvitado,
        nombreAdministrador,
        correoAdministrador,
        empresa
    };

    const confirmacion = confirm('¿Está seguro de que desea invitar a ' + correoInvitado + ' al puesto de ' + nombrePuesto + '?');

    if (confirmacion) {
        try {
            const respuesta = await fetch('http://localhost:3000/invitarUsuarioAPuesto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const resultado = await respuesta.json();
            console.log(resultado);
            alert('La invitación se ha enviado correctamente.');
            window.location.reload();
        } catch (error) {
            console.log(error);
            alert(error);
        }
    } else {
        alert('La invitación no se ha enviado.');
    }
};

async function cargarAplicaciones() {
    const empresa = localStorage.getItem("empresa");
    const userEmail = localStorage.getItem("userEmail");

    try {
        const respuestaPuestos = await fetch('http://localhost:3000/empleosAdmin?empresa=' + empresa);
        const respuestaAplicaciones = await fetch('http://localhost:3000/administrarAplicaciones?empresa=' + empresa);

        const puestos = await respuestaPuestos.json();
        const aplicaciones = await respuestaAplicaciones.json();

        console.log(puestos);
        console.log(aplicaciones);

        const puestosHTML = document.getElementById('aplicaciones-center');

        puestos.forEach(function(puesto, i) {
            const section = 
            `
            <section class="seccion-aplicaciones">
                <section class="seccion-datos">
                    <div class="aplicacion-info">
                        <p>Puesto:</p>
                        <p>${puesto.titulo}</p>
                    </div>
                </section>
                <section class="seccion-aplicantes">
                    <table>
                        <thead>
                            <th>Postulante</th>
                            <th>Experiencia</th>
                            <th>Estado</th>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </section>
            </section>
            `;

            puestosHTML.innerHTML += section;
            
            const aplicantesHTML = document.querySelectorAll('.seccion-aplicantes tbody')[i];

            aplicaciones.forEach(function(aplicacion) {
                if (aplicacion.nombrePuesto === puesto.titulo) {
                    const aplicante = 
                    `
                    <tr>
                        <td>${aplicacion.nombreAplicante}</td>
                        <td><a href=${aplicacion.cvAplicante} target="_blank" download">Descargar CV</a></td>
                        <td>${aplicacion.estadoAplicacion}</td>
                    </tr>
                    `;

                    aplicantesHTML.innerHTML += aplicante;


                }
            });

        });
    } catch (error) {
        console.log(error);
        alert(error);
    }
};


window.onload = function() {
    dropdownPuestos();
    cargarAplicaciones();

    let formInvitacionesUsuarios = document.getElementById('invitar-usuarios');
    formInvitacionesUsuarios.addEventListener('submit', invitarUsuarioAPuesto);
};