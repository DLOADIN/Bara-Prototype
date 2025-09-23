 <div className={`w-full bg-gradient-to-r from-blue-50 to-indigo-100 border-b border-gray-200 px-[15px] py-[15px] ${className}`}>
    <div className={`w-full bg-gradient-to-r from-blue-50 to-indigo-100 border-b border-gray-200 px-4 py-2 ${className}`}>
      <div className="w-full">
        <div className="flex items-center justify-center h-[500px]">
        <div className="flex items-center justify-center h-[125px] md:h-[150px]">
          {loading ? (
            <div className="animate-pulse flex w-full h-full">
              <div className="rounded bg-gray-300 w-full h-full"></div>
            </div>
          ) : bannerToShow ? (
            <div 
              className="w-full h-full cursor-pointer hover:opacity-90 transition-opacity overflow-hidden rounded-lg"
              className="w-full h-full max-h-[120px] md:max-h-[140px] object-contain cursor-pointer hover:opacity-90 transition-opacity overflow-hidden rounded-lg"
              onClick={onClick}
            >
              <img
                src={bannerToShow.banner_image_url}
                alt={bannerToShow.banner_alt_text || t('bannerAd.placeholder.title')}
                // style={{aspectRatio: 16 / 9 }}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full text-center">
              <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-lg flex flex-col items-center justify-center px-4">
                <span className="text-gray-700 font-semibold text-lg">{t('bannerAd.placeholder.title')}</span>
                <span className="text-gray-600 text-sm mt-2">{t('bannerAd.placeholder.subtitle')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerAd;