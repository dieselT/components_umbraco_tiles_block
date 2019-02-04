angular.module("umbraco").controller("TilesBlock.Controller", function ($scope, dialogService, entityResource) {

	$scope.sortMode = false;

	function Item(type) {
		this.contentId = 0;
		this.contentName = 'Choose an item...';
		this.type = type;
		this.title = '';
		this.eyebrow = '';
		this.description = '';
		this.image = null;
		this.link = null;
	}

	$scope.control.value = $scope.control.value || [];

	$scope.addItem = function (alias) {
		$scope.control.value.push(new Item(alias));
		_.defer(function () { $scope.$apply(); });
	}

	$scope.removeItem = function (item) {
		$scope.control.value.splice($scope.control.value.indexOf(item), 1);
		_.defer(function () { $scope.$apply(); });
	}

	$scope.availableItems = [
		{
			alias: 'newsTile',
			name: 'News tile',
			icon: 'icon-newspaper-alt'
		},
		{
			alias: 'customTile',
			name: 'Custom tile',
			icon: 'icon-post-it'
		}
	];

	$scope.openOverlay = function (event) {
		$scope.overlay = {
			view: "itempicker",
			title: "Choose type of tile",
			show: true,
			filter: false,
			event: event,
			availableItems: $scope.availableItems,
			submit: function (model) {
				$scope.addItem(model.selectedItem.alias);
				$scope.overlay.show = false;
				$scope.overlay = null;
			},
			close: function (oldModel) {
				$scope.overlay.show = false;
				$scope.overlay = null;
			}
		};
	};

	$scope.openContentPickerDialog = function (item) {
		dialogService.treePicker({
			filterCssClass: 'not-allowed not-published',
			//filter: "newsItem,smthElse",
			treeAlias: 'content',
			section: 'content',
			callback: function (data) {
				if (data) {
					$scope.control.value[$scope.control.value.indexOf(item)].contentId = data.id;
					$scope.control.value[$scope.control.value.indexOf(item)].contentName = data.name;
				}
			}
		});
	};

	$scope.itemName = function (contentId)
	{
		if (contentId > 0) {
			entityResource.getById($scope.control.value, 'Document')
				.then(function(data) {
					return data.name;
				});
		} else {
			return 'Choose an item...';
		}
	}

	$scope.addImage = function (item) {
		$scope.mediaPickerOverlay = {
			view: 'mediapicker',
			disableFolderSelect: true,
			onlyImages: true,
			show: true,
			submit: function (model) {
				$scope.control.value[$scope.control.value.indexOf(item)].image = model.selectedImages[0].image;
				$scope.mediaPickerOverlay.show = false;
				$scope.mediaPickerOverlay = null;
			},
			close: function () {
				$scope.mediaPickerOverlay.show = false;
				$scope.mediaPickerOverlay = null;
			}
		};
	};
	$scope.removeImage = function (item) {
		$scope.control.value[$scope.control.value.indexOf(item)].image = null;
	};


	var ngi = angular.element('body').injector();
	var uDialogService = ngi.get('dialogService');
	$scope.chooseLink = function(item) {
		$scope.control.value[$scope.control.value.indexOf(item)].link = null;

		uDialogService.open({
			template: '../App_Plugins/GibeLinkPicker/Dialogs/linkpicker.html',
			show: true,
			callback: function (e) {
				$scope.control.value[$scope.control.value.indexOf(item)].link = {
					id: e.id || 0,
					name: e.name || '',
					url: e.url,
					target: e.target || '_self',
					hashtarget: e.hashtarget || ''
				};

				uDialogService.close();
			}
		});
	}

	$scope.editLink = function (item) {
		uDialogService.open({
			template: '../App_Plugins/GibeLinkPicker/Dialogs/linkpicker.html',
			show: true,
			target: item.link,
			callback: function (e) {
				$scope.control.value[$scope.control.value.indexOf(item)].link = {
					id: e.id || 0,
					name: e.name || '',
					url: e.url,
					target: e.target || '_self',
					hashtarget: e.hashtarget || ''
				};
				uDialogService.close();
			}
		});
	};

	$scope.removeLink = function (item) {
		$scope.control.value[$scope.control.value.indexOf(item)].link = null;
	};
});
