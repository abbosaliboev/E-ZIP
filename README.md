# Front Folder Structer 

src/
  assets/
    images/          # Uy rasmlari, icon, logo
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
      ListingsGrid.jsx   # Cards ro'yxati
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
    listings.js       # uy e’lonlari CRUD
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