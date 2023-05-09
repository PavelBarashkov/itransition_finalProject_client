import { useEffect } from "react";
import { useContext, useState } from "react"
import { Button, NavDropdown } from "react-bootstrap"
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import "../../NavBar.css"

import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

export const NavDropdownType = observer(() => {
    const {i18n, t} = useTranslation("common");


    const [type, setType] = useState(t("category"));
    const {review} = useContext(Context);

    return (
        <select
          className="nav-link bg-dark border-0 ml-1 mr-2"
          onChange={(event) => {
            setType(event.target.value);
            const selectedType = review.types.find((type) => type.name === event.target.value);
            review.setSelectedType(selectedType || 0);
          }}
          value={type}
        >
            <option value={t("category")}>{t("category")}</option>
            {review.types.map((item) => (
                <option key={item.id} value={item.name}>
                    {item.name === "Книги" ? t("books") :
                    item.name === "Кино" ? t("cinema") :
                    item.name === "Сериалы" ? t("series") :
                    t(item.name) || item.name}
              </option>
            ))}
        </select>
      );

})



export const NavDropdownLanguage = () => {

    
    const {i18n, t} = useTranslation("common");

    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.value)
    }
    useEffect(() => {
        if(localStorage.getItem('i18nextLng').length > 2) {
            i18next.changeLanguage("en");
        }
      }, [])


    const  [language, setLanguage] = useState('Язык');
    return(
        <select
                className="nav-link bg-dark border-0 ml-1 mr-2"
                value={localStorage.getItem("i18nextLng")}
                onChange={handleLanguageChange}
            >
                <option value="en">English</option>
                <option value="ru">Русский</option>
            </select>

       
    );
}