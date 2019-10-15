const g_connector = new Connector("3LR6Qgf0euuDfpT90VAjXnWCK3lwhfU5fNt8fbGS", "NuhivZoUWgIf4M33Zp3Iu6UVtzY6qFMXRwzNPVFm");
var idEditing = undefined;
var objectEditing = undefined;

function setupConnector()
{
    g_connector.SetUrl("https://parseapi.back4app.com/classes/Person/");
}

function getAllHandler(data)
{
    JSON.parse(data).results.forEach(t => addToHtml(t));
}

function getOneHandler(data)
{
    addToHtml(JSON.parse(data));
}

function handleInsertedData(data)
{
    let parsedData = JSON.parse(data);
    g_connector.GetOneObject(parsedData.objectId, getOneHandler);
}

function reloadData()
{
    g_connector.GetData(getAllHandler);
}

function formatDataForHtml(data)
{
    return "" + data.name + "<br>" + data.age + " years old<br>" + data.sex;
}

function addToHtml(data)
{
    let dataHolder = document.getElementById("personList");

    let child = document.createElement("button");

    child.innerHTML = formatDataForHtml(data);
    child.setAttribute("objectId", data.objectId);
    child.setAttribute("type","button");

    // Mark person to edit or delete
    child.addEventListener("click", () => {
        document.getElementById("txtEdFieldName").value = data.name;
        document.getElementById("nmbEdFieldAge").value = data.age;
        document.getElementById("txtEdFieldSex").value = data.sex;
        idEditing = data.objectId;
        objectEditing = child;
    });

    dataHolder.appendChild(child);
}

function addListeners()
{
    document.getElementById("btnNewPerson").addEventListener("click", () => {
        let name = document.getElementById("txtFieldName").value.trim();
        let age = +document.getElementById("nmbFieldAge").value;
        let sex = document.getElementById("txtFieldSex").value;

        if (!name || !age || !sex)
            return;
        
        let person = {};
        person.name = name;
        person.age = age;
        person.sex = sex;
        
        g_connector.AddData(person, handleInsertedData);

         // Clear fields
         document.getElementById("txtFieldName").value = "";
         document.getElementById("nmbFieldAge").value = "";
         document.getElementById("txtFieldSex").value = "";
    });
    document.getElementById("btnEdPerson").addEventListener("click", () => {
        if (!idEditing || !objectEditing)
            return;

        let name = document.getElementById("txtEdFieldName").value.trim();
        let age = +document.getElementById("nmbEdFieldAge").value;
        let sex = document.getElementById("txtEdFieldSex").value;

        if (!name || !age || !sex)
            return;
        
        let person = {};
        person.name = name;
        person.age = age;
        person.sex = sex;
        
        g_connector.UpdateData(idEditing, person);
        objectEditing.innerHTML = formatDataForHtml(person);

        // Clear fields
        document.getElementById("txtEdFieldName").value = "";
        document.getElementById("nmbEdFieldAge").value = "";
        document.getElementById("txtEdFieldSex").value = "";
    });
    document.getElementById("btnRePerson").addEventListener("click", () => {
        if (!idEditing || !objectEditing)
            return;

        g_connector.RemoveData(idEditing);
        let parent = document.getElementById("personList");
        parent.removeChild(objectEditing);

        // Clear fields
        
        document.getElementById("txtEdFieldName").value = "";
        document.getElementById("nmbEdFieldAge").value = "";
        document.getElementById("txtEdFieldSex").value = "";
    });
}
window.onload = () => {
    addListeners();
    setupConnector();
    reloadData();
}