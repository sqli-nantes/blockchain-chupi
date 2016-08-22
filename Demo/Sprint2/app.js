var contract, data, price;
var validate = 0;
var optionsHttp = {
    host: "10.33.44.182",
    port: 8080
};


$('#scan').on('click', function() {
    $.get(
        "http://localhost:8088/scan",
        function(data) {
            console.log(typeof data.contract.abi);
            console.log(typeof data.contract.address);
            document.getElementById('nomVoiture').innerHTML = data.name;
            document.getElementById('2').style.display = "inline";
            $('#scan').prop('disabled', true);
            contract = data.contract;
        }
    );
})

$('#louer').on('click', function() {
    $.get(
        "http://localhost:8088/louer", {
            contract: JSON.stringify(contract)
        }).done(
        function() {
            document.getElementById('3').style.display = "inline";
            $('#louer').prop('disabled', true);
            var source = new EventSource("http://localhost:8088/carvalide");
            source.onmessage = function(e) {
                var jsonData = JSON.parse(e.data);
                var valideChoupette = document.getElementById('valideChoupette');
                valideChoupette.innerHTML = "Trajet validé par Choupette";
                valideChoupette.className = "btn btn-success";
                ++validate;
                console.log(validate);
                if (validate == 2)
                    document.getElementById('aurevoir').style.display = "inline";

            };
        }
    );
});

function goto(pos) {
    var xpos = document.pos.Xpos.value;
    var ypos = document.pos.Ypos.value;
    $.get(
        "http://localhost:8088/goto", {
            x: xpos,
            y: ypos
        }).done(
        function(data) {
            document.getElementById('prix').innerHTML = data;
            price = data;
            document.getElementById('4').style.display = "inline";
            console.log(data);
            $('#go').prop('disabled', true);
        }
    );
}

$('#terminer').on('click', function() {
    $.get(
        "http://localhost:8088/goo", {
            price: price
        }).done(
        function() {
            $('.btn').prop('disabled', true);
            document.getElementById('bonvoyage').style.display = "inline";
            $('.valide').prop('disabled', false);

        }
    );
});

$('.annuler').on('click', function() {
    $.get(
        "http://localhost:8088/annuler").done(
        function() {
            $('.btn').prop('disabled', true);
            document.getElementById('aurevoir').style.display = "inline";
        }
    );
});

$('#valide').on('click', function() {
    $.get(
        "http://localhost:8088/valide").done(
        function() {
            ++validate;
            console.log(validate);
            $('.btn').prop('disabled', true);
            if (validate == 2)
                document.getElementById('aurevoir').style.display = "inline";
        }
    );
});
