// Create array of options that user can select
const optionsProject = (allProject) => {
    var names = []
    var index = 0
    allProject.map((p) => {
        names[index] = {value: p.name, label: p.name}
        index = index + 1
    })

    return names
}

// Use when want to get all project name that user selected
const getProjectName = (project) => {
    let menuName = []
    project.map((p, index) => {
        menuName[index] = p.name
    })
    return menuName
}

// Create array of submenu of projects selected
const subMenuOptions = (event, allProject) => {
    var filteredProject = [{name: "", options: [{value: "", label: ""}]}]
    var index = 0

    event.map((inp) => {
        allProject.map((moc) => {
            var option = []
            var indexOption = 0
            // if project in input
            if (inp.value === moc.name) {
                moc.subMenu?.map((sub) => {
                    option[indexOption] = {value: sub, label: sub}
                    indexOption = indexOption + 1
                })
                filteredProject[index] = {name: inp.value, options: option}
                index = index + 1
            }
        })
    })

    return filteredProject
}


export { optionsProject, getProjectName, subMenuOptions }