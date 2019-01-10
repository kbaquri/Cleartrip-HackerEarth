var jsonProjects;
var html;
var perc;
var daysLeft;
var currency_symbols = {
    'usd': '$', // US Dollar
    'cad': '$', // Canadian Dollar
    'aud': '$', // Australian Dollar
    'eur': '€', // Euro
    'chf': 'chf', //Swiss franc
    'dkk': 'kr.', //Danish Krone
    'crc': '₡', // Costa Rican Colón
    'gbp': '£', // British Pound Sterling
    'ils': '₪', // Israeli New Sheqel
    'inr': '₹', // Indian Rupee
    'jpy': '¥', // Japanese Yen
    'krw': '₩', // South Korean Won
    'ngn': '₦', // Nigerian Naira
    'php': '₱', // Philippine Peso
    'pln': 'zł', // Polish Zloty
    'pyg': '₲', // Paraguayan Guarani
    'thb': '฿', // Thai Baht
    'uah': '₴', // Ukrainian Hryvnia
    'vnd': '₫', // Vietnamese Dong
};

function loadProjects(json) {

    html = "";
    perc = "";
    daysLeft = "";

    html += "<div class=\"row\">";

    json.forEach(function (val) {

        var keys = Object.keys(val);
        html += "<div class =\"card  border-dark mb-3\"  style=\"width: 22rem;\">";
        html += "<img class=\"card-img-top\" src=\"img/download.svg\" alt=\"" + val[" s.no "] + "\">";
        html += "<div class=\"card-body\">";

        html += "<a href=\"https://www.kickstarter.com" + val["url"] + "\">";
        html += "<h5 class=\"card-title\">" + val["title"] + "</h5>";
        html += "</a>"

        html += "<h6 class=\"card-subtitle text-muted\">by " + val["by"] + "<br>" + val["location"] + ", " + val["country"] + " <span class=\"badge badge-secondary\">" + val["type"] + "</span></h6><br>";
        html += "<p class=\"card-text blurb\">" + val["blurb"] + "</p>";

        if (val["percentage.funded"] >= 100) {
            perc = "100%";
        } else {
            perc = val["percentage.funded"] + "%";
        }

        html += "<div class=\"progress\" style=\"margin-bottom:10px;\">";
        html += "<div class=\"progress-bar\" role=\"progressbar\" style=\"width:" + perc + "; + aria-valuenow=" + perc + "; + aria-valuemin=\"0\" aria-valuemax=\"100\"\">" + val["percentage.funded"] + "%";
        html += "</div></div>";

        html += "<p class=\"card-text details\">" + currency_symbols[val["currency"]] + val["amt.pledged"] + " Pledged<br>";
        html += val["num.backers"] + " Backers<br>";


        var endDate = new Date(val["end.time"]);
        var currentDate = new Date();
        var daysDifference = Math.floor((Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) -
            Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) / (1000 * 60 * 60 * 24));

        if (daysDifference >= 0) {
            daysLeft = daysDifference + "days left";
        } else {
            daysLeft = "Expired";
        }
        html += daysLeft + "</p>";

        html += "<a class=\"btn btn-primary\" href=\"https://www.kickstarter.com" + val["url"] + "\" role=\"button\">Open Project</a>";


        html += "</div></div>";

    });

    html += "</div>";

    $(".projects").html(html);

}

$(document).ready(function () {

    $.getJSON("http://starlord.hackerearth.com/kickstarter", function (json) {

        jsonProjects = json;

        loadProjects(json);
    });

    $("#searchInput").on("keyup", function () {

        var value = $(this).val().toLowerCase();

        var json = jsonProjects.filter(function (val) {
            return (val.title.toLowerCase().indexOf(value) > -1);
        });

        loadProjects(json);
    });

    $("#searchLocation").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        var json = jsonProjects.filter(function (val) {
            return ((val.location.toLowerCase() + val.country.toLowerCase()).indexOf(value) > -1);
        });

        loadProjects(json);
    });


    $("#pledge").click(function () {
        var prop = "amt.pledged";
        var $this = $(this);
        if ($this.data("clicked")) {
            $this.data('clicked', false);
            sortResult(prop, false);
        } else {
            $this.data('clicked', true);
            sortResult(prop, true);
        }
    });
    $("#funded").click(function () {
        var prop = "percentage.funded";
        var $this = $(this);
        if ($this.data("clicked")) {
            $this.data('clicked', false);
            sortResult(prop, false);
        } else {
            $this.data('clicked', true);
            sortResult(prop, true);
        }
    });
    $("#backers").click(function () {
        var prop = "num.backers";
        var $this = $(this);
        if ($this.data("clicked")) {
            $this.data('clicked', false);
            sortResult(prop, false);
        } else {
            $this.data('clicked', true);
            sortResult(prop, true);
        }
    });
    $("#date").click(function () {
        var prop = "end.time";
        var $this = $(this);
        if ($this.data("clicked")) {
            $this.data('clicked', false);
            sortResult(prop, false);
        } else {
            $this.data('clicked', true);
            sortResult(prop, true);
        }
    });

});

function sortResult(prop, asc) {
    var json = jsonProjects.sort(function (a, b) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });

    loadProjects(json);
}