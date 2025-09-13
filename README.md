# Front Folder Structer 
```
src/
  assets/
    images/          # Home pic, icon, logo
    styles/
      _variables.scss
      _mixins.scss
      globals.scss   # Bootstrap import + custom style
  components/
    layout/
      Navbar.jsx
      Footer.jsx
      PageContainer.jsx
    home/
      HeroSearch.jsx     # Search by station/date/tenants
      FiltersSection.jsx # "Most searched filters" blok
      ListingsGrid.jsx   # Card list
    listings/
      ListingCard.jsx
      ListingDetailModal.jsx
      ListingCarousel.jsx
      ListingInfo.jsx
      OwnerContact.jsx   # Chat button / owner info
    common/
      ButtonPrimary.jsx
      InputField.jsx
      SelectField.jsx
      DatePickerField.jsx
      ModalWrapper.jsx
      Loader.jsx
    user/
      LoginForm.jsx
      SignupForm.jsx
      MyPage.jsx
  pages/
    Home.jsx
    Listings.jsx
    ListingDetail.jsx
    MyPage.jsx
    Auth.jsx
  routes/
    AppRouter.jsx
  services/
    api.js            # fetch wrappers (mock yoki backend API)
    listings.js       # house cards CRUD
    auth.js           # login/signup
    chat.js           # chat API
  hooks/
    useAuth.js
    useModal.js
    useResponsive.js
  store/
    userSlice.js      # auth state
    listingsSlice.js
  App.jsx
  main.jsx
  ```


  ```
  # SASS Structure
  styles/
  base/
    _reset.scss        # CSS reset yoki normalize
    _typography.scss   # font, text styles (h1–h6, p, a)
    _utilities.scss    # helper klasslar (text-center, d-flex, mt-1 va h.k.)
  components/
    _buttons.scss      # tugmalar (primary, secondary, outline)
    _cards.scss        # ListingCard, info card uchun umumiy style
    _forms.scss        # input, select, datepicker uchun
    _navbar.scss       # navbarga maxsus style
    _modal.scss        # modal o‘ziga xos style
  layout/
    _grid.scss         # container, row/col, responsive mixinlar
    _header.scss       # Navbar + HeroSearch qismi
    _footer.scss       # footer
  pages/
    _home.scss         # Home sahifasiga maxsus style
    _listings.scss     # Listings sahifasi
    _detail.scss       # Listing detail sahifasi
    _mypage.scss       # MyPage sahifasi
  abstracts/
    _variables.scss    # ranglar, fontlar, spacing, breakpoints
    _mixins.scss       # media query, flex-center, text-truncate kabi helperlar
  globals.scss         # Bootstrap import + barcha SCSSlarni @import qiluvchi

  ```